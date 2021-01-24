using System;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Redis;
using NLog;
using System.Linq;
using Microsoft.AspNetCore.Identity;

namespace Mediforward.Common.Helper
{
    public static class ConfigurationManager
    {
        public static AppSetting AppSetting { get; set; }
        public static IConfiguration SetConfiguration(this IConfiguration configuration, IWebHostEnvironment env, bool isUiApplication = false)
        {
            var builder = new ConfigurationBuilder()
                      .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                      .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true, reloadOnChange: true)
                      .AddEnvironmentVariables();
            configuration = builder.Build();
            return configuration;
        }

        public static void AddCache(this IServiceCollection services)
        {
            if (AppSetting.CacheEnabled)
            {
                services.AddSingleton<IDistributedCache>(serviceProvider =>
                   new RedisCache(new RedisCacheOptions
                   {
                       Configuration = AppSetting.CacheDbConnectionString,
                       InstanceName = AppSetting.CacheInstanceName
                   }));
            }
            else // default in memory Cache
            {
                services.AddCache();
            }
        }

        public static void AddProfiler(this IServiceCollection services)
        {
            if (AppSetting.ProfilerEnabled)
            {
                services.AddMiniProfiler(options =>
                {
                    options.RouteBasePath = "/profiler";
                    options.TrackConnectionOpenClose = true;
                });
            }
        }

        public static void UseProfiler(this IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (AppSetting.ProfilerEnabled)
            {
                app.UseMiniProfiler();
            }
        }
        public static void AddLog(this IServiceCollection services)
        {
            //  LogManager.Configuration.Variables["connectionString"] = AppSetting.LogDbConnectionString;
        }

        public static InstituteSetting CurrentInstituteSetting(this HttpRequest httpRequest)
        {
            var enterprise = AppSetting.InstituteSettings.FirstOrDefault(o => o.WebHost.Equals(httpRequest.Host.Host, StringComparison.CurrentCultureIgnoreCase));
            if (enterprise == null)
            {
                throw new NotImplementedException($"The Application is not configured to use {httpRequest.Host.Host}. Please change the Configuration in the AppSettings File.");
            }
            return enterprise;
        }
    }

    public class AppSetting
    {
        public string DbConnectionString { get; set; }
        public string LogDbConnectionString { get; set; }
        public string FileDbConnectionString { get; set; }
        public string CacheDbConnectionString { get; set; }
        public bool ProfilerEnabled { get; set; }
        public bool IsProduction { get; set; } = false;
        public bool IsDevelopmentMode { get; set; } = false;

        public int OtpValidTimeInSeconds { get; set; }
        public bool CacheEnabled { get; set; }
        public string CacheInstanceName { get; set; }
        public string CorsPolicyName { get; set; }

        public List<Service> Services { get; set; }
        public List<InstituteSetting> InstituteSettings { get; set; }
        public SmtpSetting SmtpSetting { get; set; }
        public SmsSetting SmsSetting { get; set; }
        public string WebEndpoint { get; set; }
        public string ServiceEndpoint { get; set; }

        public List<ExternalLogin> ExternalLogins { get; set; }
        public RestAPIs RestAPIs { get; set; }
        public PaymentGateway PaymentGateway { get; set; }
        public VideoCallSetting VideoCallSetting { get; set; }
        public TokBoxVideoSetting TokBoxVideoSetting { get; set; }
        public NexmoSMSSetting NexmoSMSSetting { get; set; }
        public JwtSetting Jwt { get; set; }
        public RazorPaySettings RazorPaySetting { get; set; }
    }

    public class Service
    {
        public string ServiceName { get; set; }

        public string ServiceUrl { get; set; }
    }
    public class InstituteSetting
    {
        public string ClientId { get; set; }
        public string ClientSecrate { get; set; }
        public string ResourceDirectory { get; set; } = "default";
        public string WebHost { get; set; } = "localhost";
    }

    public class SmtpSetting
    {
        public string TestEmailReceipent { get; set; }
        public string FromAddress { get; set; }
        public string FromDisplayName { get; set; }
        public bool UseDefaultCredentials { get; set; } = true;
        public string Host { get; set; }
        public int Port { get; set; } = 587;
        public string UserName { get; set; }
        public string Password { get; set; }
        public bool EnableSsl { get; set; } = false;
        public string EmailSignature { get; set; }
        public string EmailAssetsUrl { get; set; }
    }

    public class SmsSetting
    {
        public string AccountId { get; set; }
        public string AuthToken { get; set; }
        public string ApiKey { get; set; }
        public string ApiSecrate { get; set; }
        public string FromPhone { get; set; }
        public string APIUrl { get; set; }
        public string SmsHeader { get; set; }
    }

    public class ExternalLogin
    {
        public string Provider { get; set; }
        public string DisplayName { get; set; }
        public string ClientId { get; set; }
        public string ClientSecret { get; set; }
    }

    public class RestAPIs
    {
        public string NPIRegistery { get; set; }
    }

    public class PaymentGateway
    {
        public string Host { get; set; }
        public string PublicKey { get; set; }
        public string SecretKey { get; set; }
    }

    public class VideoCallSetting
    {
        public string AccountId { get; set; }
        public string ApiKey { get; set; }
        public string ApiSecret { get; set; }
        public string AuthToken { get; set; }
    }

    public class TokBoxVideoSetting
    {
        public int APIKEY { get; set; }
        public string APISecret { get; set; }
    }

    public class NexmoSMSSetting
    {
        public string APIKEY { get; set; }
        public string APISecret { get; set; }

    }

    public class JwtSetting
    {
        public string SecretKey { get; set; }
        public string Issuer { get; set; }
        public string https { get; set; }
        public string Audience { get; set; }

    }

    public class RazorPaySettings
    {
        public string apiKey { get; set; }
        public string appSecret { get; set; }
    }


}
