using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CorrelationId.DependencyInjection;
using Mediforward.Common.Helper;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using System.Reflection;
using System.IO;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Serialization;
using System.Net.Mime;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;
using CorrelationId;
using Microsoft.AspNetCore.Http;
using Mediforward.Data;
using Mediforward.Common.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Mediforward.Common.Contracts;
using Mediforward.Business;
using Microsoft.Extensions.FileProviders;
using Mediforward.Common;
using Mediforward.Data.Repo;

namespace Mediforward.Service
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddOptions();
            ConfigurationManager.AppSetting = Configuration.Get<AppSetting>();
            services.AddLog();
            services.AddDataProtection().SetDefaultKeyLifetime(TimeSpan.MaxValue);
            services.AddCors(options => options.AddPolicy("AllowAll", p => p.WithOrigins("https://*.mediforward.in", "http://*.mediforward.in","http://localhost:5006").SetIsOriginAllowedToAllowWildcardSubdomains().AllowAnyMethod().AllowAnyHeader().AllowCredentials()));
            AddSwaggerRegistrations(services);
            var mvcBuilder = services.AddControllers(options =>
            {
                options.CacheProfiles.Add("Default", new CacheProfile() { Duration = 60 });
                options.CacheProfiles.Add("Never", new CacheProfile() { Location = ResponseCacheLocation.None, NoStore = true });
            });
            mvcBuilder.AddJsonOptions(opt =>
            {
                opt.JsonSerializerOptions.IgnoreNullValues = true;
                opt.JsonSerializerOptions.PropertyNamingPolicy = null;

            });

            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            #region DB and identity
            services.AddDbContext<AppDBContext>();

            services.AddIdentity<User, IdentityRole>()
                .AddEntityFrameworkStores<AppDBContext>()
                 .AddRoleManager<AppRoleContext>()
                .AddDefaultTokenProviders();


            services
           .AddIdentityCore<User>(x =>
           {
               x.SignIn.RequireConfirmedEmail = false;
               x.Password.RequireDigit = false;
               x.Password.RequireLowercase = false;
               x.Password.RequiredLength = 8;
               x.Password.RequireLowercase = false;
               x.Password.RequireNonAlphanumeric = false;
               x.Password.RequireUppercase = false;
           })
           .AddEntityFrameworkStores<AppDBContext>()
           .AddDefaultTokenProviders();
            #endregion

            #region Configure Api BehaviorOptions

            services.Configure<ApiBehaviorOptions>(options =>
            {
                options.InvalidModelStateResponseFactory = actionContext =>
                {

                    var result = new BadRequestObjectResult(actionContext.ModelState);
                    result.ContentTypes.Add(MediaTypeNames.Application.Json);
                    return result;
                };
            });

            #endregion Configure Api BehaviorOptions
            AddToScope(services);
            //services.AddCache();
            var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(ConfigurationManager.AppSetting.Jwt.SecretKey));
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

            })
                .AddJwtBearer(options =>
                {
                    options.RequireHttpsMetadata = false;
                    options.SaveToken = true;
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        NameClaimType = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = ConfigurationManager.AppSetting.Jwt.Issuer,
                        ValidAudience = ConfigurationManager.AppSetting.Jwt.Audience,
                        IssuerSigningKey = signingKey,
                        ClockSkew = TimeSpan.Zero
                    };
                    options.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            var accessToken = context.Request.Query["access_token"];

                            // If the request is for our hub...
                            var path = context.HttpContext.Request.Path;
                            if (!string.IsNullOrEmpty(accessToken) &&
                                (path.StartsWithSegments("/mediHub")))
                            {
                                // Read the token out of the query string
                                context.Token = accessToken;
                            }
                            return Task.CompletedTask;
                        }
                    };
                });

            services.AddSignalR(e =>
            {
                e.MaximumReceiveMessageSize = 102400000;
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, AppDBContext applicationRepository, RoleManager<IdentityRole> roleManager, UserManager<User> userManager)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            if (!env.IsDevelopment())
            {
                app.UseHsts();
            }
            app.UseExceptionHandler("/Error");
            app.UseCors("AllowAll");
            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(
            Path.Combine(env.ContentRootPath, "static")),
                RequestPath = "/static"
            });

            UserSwagger(app);
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<MediHub>("/mediHub");
            });



            applicationRepository.Database.Migrate();
            EnsureRoleCreated(roleManager).Wait();
            EnsureUserCreated(userManager).Wait();
            if (env.EnvironmentName == "Development")
            {
                //DeleteTestUsers(userManager).Wait();
            }
        }

        private async Task EnsureRoleCreated(RoleManager<IdentityRole> roleManager)
        {
            if (!await roleManager.RoleExistsAsync("superadmin"))
            {
                await roleManager.CreateAsync(new IdentityRole("superadmin"));
            }
            if (!await roleManager.RoleExistsAsync("admin"))
            {
                await roleManager.CreateAsync(new IdentityRole("admin"));
            }
            if (!await roleManager.RoleExistsAsync("doctor"))
            {
                await roleManager.CreateAsync(new IdentityRole("doctor"));
            }
            if (!await roleManager.RoleExistsAsync("patient"))
            {
                await roleManager.CreateAsync(new IdentityRole("patient"));
            }
        }

        private async Task EnsureUserCreated(UserManager<User> userManager)
        {
            if (userManager.FindByNameAsync("ForwardVisit").Result == null)
            {
                var user = new User()
                {
                    UserName = "ForwardVisit",
                    Email = "administrator@hitforward.com",
                    EmailConfirmed = true,
                };

                var result = userManager.CreateAsync(user, "$xpediti0N").Result;
                if (result.Succeeded)
                {
                    userManager.AddToRoleAsync(user, "superadmin").Wait();
                }
            }
        }

        private async Task DeleteTestUsers(UserManager<User> userManager)
        {
            var users = await userManager.Users.Where(u => u.Email.Contains("sujit") || u.Email.Contains("test")).ToListAsync();
            foreach (User usr in users)
            {
                //await userManager.DeleteAsync(usr);
            }
        }

        private void AddSwaggerRegistrations(IServiceCollection services)
        {
            #region Swagger Integration

            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Version = "v1",
                    Title = "Mediforward",
                    Description = "API Services for Mediforward",
                });
                options.IgnoreObsoleteActions();
                options.CustomSchemaIds(x => x.FullName);
                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = "Login to the API using PasswordSignIn method with your UserName and Password. Copy and Paste the Access Token here.",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey
                });
                options.AddSecurityRequirement(new OpenApiSecurityRequirement()
                {
                    {
                        new OpenApiSecurityScheme
                        {
                           Reference = new OpenApiReference
                           {
                               Type = ReferenceType.SecurityScheme,
                               Id = "Bearer"
                           },
                           Scheme = "oauth2",
                           Name = "Bearer",
                           In = ParameterLocation.Header,

                        },
                        new List<string>()
                    }
                });
                var xmlFile = $"{Assembly.GetEntryAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                if (File.Exists(xmlPath))
                {
                    options.IncludeXmlComments(xmlPath);
                }
            });

            #endregion Swagger Integration
        }

        private void UserSwagger(IApplicationBuilder app)
        {
            #region Swagger Integration
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "API Version 1");
                c.RoutePrefix = "";
            });

            #endregion Swagger Integration
        }

        private void AddToScope(IServiceCollection services)
        {
            services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
            services.AddScoped<ISuperAdminRepo, SuperAdminRepo>();
            services.AddScoped<ISuperAdminManager, SuperAdminManager>();
            services.AddScoped<IFileUpload, UploadToFileSystem>();
            services.AddScoped<IProviderRepo, ProviderRepo>();
            services.AddScoped<IProviderManager, ProviderManager>();
            services.AddScoped<IPatientRepo, PatientRepo>();
            services.AddScoped<IPatientManager, PatientManager>();
            services.AddScoped<ICommonRepo, CommonRepo>();
            services.AddScoped<ICommonManager, CommonManager>();
            services.AddScoped<IEmailService, EmailService>();
            services.AddScoped<IPaymentService, PaymentService>();
            services.AddScoped<ISMSService, SMSService>();
        }
    }
}
