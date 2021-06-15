using API.Configurations;
using API.Model;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System;
using VicFramework.Context;
using VicFramework.Library;

namespace API
{
    public class Startup
    {
        public Startup(IConfiguration configuration, IHostingEnvironment hostingEnvironment)
        {
            Configuration = configuration;
            HostingEnvironment = hostingEnvironment;
        }

        public IConfiguration Configuration { get; }
        public IHostingEnvironment HostingEnvironment { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            // Injeção dos contextos utilizados na aplicação [VicFramework.dll]
            services.AddDbContext<BCUDbContext>(options => options.UseSqlServer(Criptografia.Descriptografar(Configuration["ConnectionStrings:BCU"])));
            services.AddDbContext<VicSaudeSegurancaContext>(options => options.UseSqlServer(Criptografia.Descriptografar(Configuration["ConnectionStrings:VicSaudeSeguranca"])));
            services.AddDbContext<FabricaDeSoftwareDbContext>(options => options.UseSqlServer(Criptografia.Descriptografar(Configuration["ConnectionStrings:FabricaDeSoftware"])));

            var tokenConfigurations = new TokenConfigurations();
            new ConfigureFromConfigurationOptions<TokenConfigurations>(Configuration.GetSection("TokenConfigurations")).Configure(tokenConfigurations);
            services.AddSingleton(tokenConfigurations);

            var emailConfigurations = new EmailConfigurations();
            new ConfigureFromConfigurationOptions<EmailConfigurations>(Configuration.GetSection("EmailConfigurations")).Configure(emailConfigurations);
            services.AddSingleton(emailConfigurations);

            var smsConfigurations = new SmsConfigurations();
            new ConfigureFromConfigurationOptions<SmsConfigurations>(Configuration.GetSection("SmsConfigurations")).Configure(smsConfigurations);
            services.AddSingleton(smsConfigurations);

            services.AddSingleton<ApiService>();
            services.AddSingleton<SmsService>();

            services.AddAuthentication(authOptions =>
            {
                authOptions.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                authOptions.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(bearerOptions =>
            {
                var paramsValidation = bearerOptions.TokenValidationParameters;
                paramsValidation.IssuerSigningKey = tokenConfigurations.SymmetricSecurityKey;
                paramsValidation.ValidAudience = tokenConfigurations.Audience;
                paramsValidation.ValidIssuer = tokenConfigurations.Issuer;

                // Valida a assinatura de um token recebido
                paramsValidation.ValidateIssuerSigningKey = true;

                // Verifica se um token recebido ainda é válido
                paramsValidation.ValidateLifetime = true;

                // Tempo de tolerância para a expiração de um token (utilizado
                // caso haja problemas de sincronismo de horário entre diferentes
                // computadores envolvidos no processo de comunicação)
                paramsValidation.ClockSkew = TimeSpan.Zero;
            });

            // Ativa o uso do token como forma de autorizar o acesso
            // a recursos deste projeto
            services.AddAuthorization(options =>
            {
                options.AddPolicy("Bearer", new AuthorizationPolicyBuilder()
                    .AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme)
                    .RequireAuthenticatedUser().Build());
                options.AddPolicy("PontoWeb", new AuthorizationPolicyBuilder()
                    .AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme)
                    .RequireAuthenticatedUser()
                    .RequireClaim("acesso_registroPonto", "True")
                    .Build());
                options.AddPolicy("AdminRH", new AuthorizationPolicyBuilder()
                    .AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme)
                    .RequireAuthenticatedUser()
                    .RequireClaim("acesso_adminRH", "True")
                    .Build());
            });

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
            services.AddMvc(options =>
            {
                options.Filters.Add(typeof(GlobalExceptionHandlingFilter));
            });

            //Evitar referência circular na serialização dos objetos para JSON, nas Controllers
            //https://docs.microsoft.com/pt-br/ef/core/querying/related-data#related-data-and-serialization
            services.AddMvc()
                    .AddJsonOptions(
                        options => options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore
             );

            //Configuração para receber "text/plain" e "application/octet-stream" no body do request
            services.AddMvc(a => a.InputFormatters.Insert(0, new RequestBodyConfiguration()));

            //Removendo Providers de Log e adicionando apenas Console durante Debug
            services.AddLogging(config =>
            {
                config.ClearProviders();

                if (HostingEnvironment.IsDevelopment())
                {
                    config.AddConsole();
                }
            });

            //Registrando classe externa contendo as injeções de dependência dos objetos de negócio da aplicação
            RegisterServices(services);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, ILoggerFactory loggerFactory)
        {
            

            if (HostingEnvironment.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                //Adicionando funcionalidade de log em texto, para GlobalExceptionHandler
                loggerFactory.AddFile(AppContext.BaseDirectory + Configuration["LoggingFile:PathLog"], 
                                      LogLevel.Error, null, false, 
                                      long.Parse(Configuration["LoggingFile:fileSizeLimitByte"]), 
                                      int.Parse(Configuration["LoggingFile:retainedFileCountLimit"]));

                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseCors(x => x
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());

            app.UseStaticFiles();

            app.UseHttpsRedirection();
            app.UseMvc();
        }

        // Método para chamada da classe externa contendo as injeções de dependência dos objetos de negócio da aplicação
        private static void RegisterServices(IServiceCollection services)
        {
            NativeInjector.RegisterServices(services);
        }
    }
}
