using API.GlobalExceptionHandling;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;

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
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
            services.AddMvc(options =>
            {
                options.Filters.Add(typeof(GlobalExceptionHandlingFilter));
            });

            services.AddScoped<GlobalExceptionHandlingFilter>();

            //Removendo Providers de Log e adicionando apenas Console durante Debug
            services.AddLogging(config =>
            {
                config.ClearProviders();

                if (HostingEnvironment.IsDevelopment())
                {
                    config.AddConsole();
                }
            });
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
    }
}
