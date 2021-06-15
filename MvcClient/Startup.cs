using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using VicPortalRH.Services;

namespace VicPortalRH
{
    public class Startup
    {
        public Startup(IHostingEnvironment hostingEnvironment)
        {
            HostingEnvironment = hostingEnvironment;

            var builder = new ConfigurationBuilder()
                .SetBasePath(HostingEnvironment.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{HostingEnvironment.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();

            Configuration = builder.Build();
        }

        public IConfiguration Configuration { get; }
        public IHostingEnvironment HostingEnvironment { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            // Configuração para uso da Session
            services.AddDistributedMemoryCache();
            services.AddSession(opt =>
            {
                opt.IdleTimeout = TimeSpan.FromHours(2);
            });            

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
            services.AddAuthorization(options =>
            {   
                options.AddPolicy("PontoWeb", policy => policy.RequireClaim("acesso_registroPonto", "True"));
                options.AddPolicy("AdminRH", policy => policy.RequireClaim("acesso_adminRH", "True"));
            });

            services.Configure<FormOptions>(options =>
            {
                options.ValueCountLimit = int.MaxValue;
            });

            //Removendo Providers de Log e adicionando apenas Console durante Debug
            services.AddLogging(config =>
            {
                config.ClearProviders();

                if (HostingEnvironment.IsDevelopment())
                {
                    config.AddConsole();
                }
            });

            

            services.AddSingleton<ApiService>();
            services.AddSingleton<VersionService>();
        }

        public void Configure(IApplicationBuilder app, ILoggerFactory loggerFactory)
        {
            app.ApplicationServices.GetService<ApiService>();

            if (HostingEnvironment.IsDevelopment())
            {
                app.UseStaticFiles(new StaticFileOptions
                {
                    FileProvider = new PhysicalFileProvider(
                Path.Combine(Directory.GetCurrentDirectory(), "Scripts")),
                    RequestPath = "/Scripts"
                });
            }
            else
            {
                //Adicionando funcionalidade de log em texto para exceptions não tratadas
                loggerFactory.AddFile(AppContext.BaseDirectory + Configuration["LoggingFile:PathLog"],
                                      LogLevel.Error, null, false,
                                      long.Parse(Configuration["LoggingFile:fileSizeLimitByte"]),
                                      int.Parse(Configuration["LoggingFile:retainedFileCountLimit"]));
               
            }

            app.UseStaticFiles();
            app.UseCookiePolicy();
            app.UseSession();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Login}/{action=Index}/{id?}");
            });
        }
    }
}
