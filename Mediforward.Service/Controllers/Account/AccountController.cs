using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Mediforward.Common;
using Mediforward.Common.Contracts;
using Mediforward.Common.Helper;
using Mediforward.Common.Identity;
using Mediforward.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;

namespace Mediforward.Service.Controllers.Account
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly IJwtTokenGenerator _jwtTokenGenerator;
        private readonly IProviderManager _providerManager;
        private readonly IPatientManager _patientIManager;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IPaymentService _paymentService;
        private readonly ICommonManager _commonManager;

        public AccountController(UserManager<User> userManager, IJwtTokenGenerator jwtTokenGenerator, IProviderManager manager, IPatientManager patientIManager, IHttpContextAccessor httpContextAccessor, IPaymentService paymentService, ICommonManager commonManager)
        {
            _userManager = userManager;
            _jwtTokenGenerator = jwtTokenGenerator;
            _providerManager = manager;
            _patientIManager = patientIManager;
            _httpContextAccessor = httpContextAccessor;
            _paymentService = paymentService;
            _commonManager = commonManager;
        }

        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register([FromBody] RegModel model)
        {
            try
            {
                var emailExists = await _userManager.FindByEmailAsync(model.Email);
                if (emailExists != null)
                    throw new ValidationException("Email Already exists.");
                var userDetails = new User()
                {
                    UserName = model.Email,
                    Email = model.Email,
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    PhoneNumber = model.PhoneNumber,
                    EmailConfirmed = true,
                    IsDeleted = false,
                    EmailNotification = true,
                    SmsNotification = true
                };
                var result = await _userManager.CreateAsync(userDetails, model.Password);
                if (!result.Succeeded)
                    throw new ValidationException("Registration failed.");
                await _userManager.AddToRoleAsync(userDetails, "doctor");
                var jwt = await _jwtTokenGenerator.GenerateToken(userDetails);
                JObject returnData = new JObject();
                returnData["token"] = jwt;
                return Ok(returnData.ToString());
            }
            catch (Exception ex)
            {
                return Ok(new JObject
                {
                    ["error"] = ErrorCodes.GetCode("GenericError"),
                    ["Message"] = ex.Message
                }.ToString());
            }

        }

        [HttpPost]
        [Route("test")]
        public async Task<IActionResult> Test()
        {
            _paymentService.CreateOrder(new PaymentModel
            {
                Amount = 250
            });
            return Ok("test");
        }


        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] RegModel model)
        {
            try
            {
                var userDetails = await _userManager.FindByNameAsync(model.Username);
                if (userDetails == null || userDetails.IsDeleted)
                    throw new GenericException(ErrorCodes.GetCode("UserNotFound"));
                var result = await _userManager.CheckPasswordAsync(userDetails, model.Password);
                if (!result)
                {
                    throw new GenericException(ErrorCodes.GetCode("PasswordIncorrect"));
                }
                bool isadmin = await _userManager.IsInRoleAsync(userDetails, "superadmin");
                var roles = await _userManager.GetRolesAsync(userDetails);
                var jwt = await _jwtTokenGenerator.GenerateToken(userDetails);
                JObject returnData = new JObject();
                returnData["token"] = jwt;
                returnData["role"] = roles[0];
                returnData["Email"] = model.Email;
                return Ok(returnData.ToString());
            }
            catch (GenericException ex)
            {
                return Ok(new JObject
                {
                    ["error"] = ex.Code,
                }.ToString());
            }
            catch (Exception ex)
            {
                return Ok(new JObject
                {
                    ["error"] = ErrorCodes.GetCode("GenericError"),
                    ["message"] = ex.Message
                }.ToString());
            }

        }

        [HttpPost]
        [Route("Provider/Register")]
        public async Task<IActionResult> RegisterProvider([FromBody] ProviderModel model)
        {
            try
            {
                var provider = await _providerManager.RegisterNewProvider(model);
                if (provider != null)
                {
                    JObject returnData = new JObject();
                    returnData["token"] = provider.Token;
                    returnData["role"] = "doctor";
                    returnData["Email"] = model.Email;
                    return Ok(returnData.ToString());
                }
                throw new GenericException(ErrorCodes.GetCode("UserAlreadyExits"));
            }
            catch (GenericException ex)
            {
                return Ok(new JObject
                {
                    ["error"] = ex.Code
                }.ToString());
            }
            catch (Exception ex)
            {
                return Ok(new JObject
                {
                    ["error"] = ErrorCodes.GetCode("GenericError"),
                    ["message"] = ex.Message
                }.ToString());
            }
        }


        [HttpPost]
        [Route("Admin/Register")]
        public async Task<IActionResult> RegisterAdmin([FromBody] ProviderModel model)
        {
            try
            {
                var provider = await _providerManager.RegisterNewAdmin(model);
                if (provider != null)
                {
                    JObject returnData = new JObject();
                    returnData["token"] = provider.Token;
                    returnData["role"] = "admin";
                    returnData["Email"] = model.Email;
                    return Ok(returnData.ToString());
                }
                throw new GenericException(ErrorCodes.GetCode("UserAlreadyExits"));
            }
            catch (GenericException ex)
            {
                return Ok(new JObject
                {
                    ["error"] = ex.Code
                }.ToString());
            }
            catch (Exception ex)
            {
                return Ok(new JObject
                {
                    ["error"] = ErrorCodes.GetCode("GenericError"),
                    ["message"] = ex.Message
                }.ToString());
            }
        }

        [HttpPost]
        [Route("Patient/Register")]
        public async Task<IActionResult> RegisterPatient([FromBody] PatientModel model)
        {
            try
            {
                var provider = await _patientIManager.RegisterPatient(model);
                if (provider != null)
                {
                    JObject returnData = new JObject();
                    returnData["token"] = provider.Token;
                    returnData["role"] = "patient";
                    returnData["Email"] = model.Email;
                    return Ok(returnData.ToString());
                }
                return Ok(new JObject
                {
                    ["error"] = ErrorCodes.GetCode("UserAlreadyExits")
                }.ToString());
            }
            catch (GenericException ex)
            {
                return Ok(new JObject
                {
                    ["error"] = ex.Code,
                    ["message"] = ex.Message
                }.ToString());
            }
            catch (Exception ex)
            {
                return Ok(new JObject
                {
                    ["error"] = ErrorCodes.GetCode("GenericError"),
                    ["message"] = ex.Message
                }.ToString());
            }
        }

        [HttpPost]
        [Route("UpdateEmail")]
        public async Task<ActionResult> UpdateEmail([FromBody] RegModel model)
        {
            try
            {

                var userId = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;
                var user = await _userManager.FindByIdAsync(userId);
                var result = await _userManager.CheckPasswordAsync(user, model.Password);
                if (result)
                {
                    user.Email = model.Email;
                    await _userManager.UpdateAsync(user);
                    var jwt = await _jwtTokenGenerator.GenerateToken(user);
                    return Ok(new JObject
                    {
                        ["token"] = jwt,
                        ["Email"] = model.Email
                    }.ToString());
                }
                throw new GenericException(ErrorCodes.GetCode("Unauthorized"));
            }
            catch (GenericException ex)
            {
                return Ok(new JObject
                {
                    ["error"] = ex.Code
                }.ToString());
            }
            catch (Exception ex)
            {
                return Ok(new JObject
                {
                    ["error"] = ex.Message
                }.ToString());
            }
        }

        [HttpPost]
        [Route("UpdatePassword")]
        public async Task<ActionResult> UpdatePassword([FromBody] RegModel model)
        {
            try
            {

                var userId = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;
                var user = await _userManager.FindByIdAsync(userId);
                var result = await _userManager.CheckPasswordAsync(user, model.Password);
                if (result)
                {
                    var passwordHash = _userManager.PasswordHasher.HashPassword(user, model.NewPassword);
                    user.PasswordHash = passwordHash;
                    await _userManager.UpdateAsync(user);

                    var jwt = await _jwtTokenGenerator.GenerateToken(user);
                    return Ok(new JObject
                    {
                        ["token"] = jwt
                    }.ToString());
                }
                throw new GenericException(ErrorCodes.GetCode("Unauthorized"));
            }
            catch (GenericException ex)
            {
                return Ok(new JObject
                {
                    ["error"] = ex.Code
                }.ToString());
            }
            catch (Exception ex)
            {
                return Ok(new JObject
                {
                    ["error"] = ex.Message
                }.ToString());
            }
        }

        [HttpGet]
        [Route("CheckEnvironment")]
        public async Task<string> CheckEnvironment()
        {
            return ConfigurationManager.AppSetting.ServiceEndpoint.IndexOf("localhost") > -1 ? "dev" : "prod";
        }

        [HttpPost]
        [Route("DeleteUser")]
        public async Task DeleteUser([FromBody] ProviderModel model)
        {
            try
            {
                var provider = await _providerManager.GetProviderDetailsById(model.ProviderId, false);
                var user = await _userManager.FindByIdAsync(provider.UserId);
                user.IsDeleted = true;
                await _userManager.UpdateAsync(user);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }

        [HttpPost]
        [Route("GenerateForgotPasswordEmail")]
        public async Task<IActionResult> GenerateForgotPasswordEmail(ForgotPasswordRequestModel model)
        {
            try
            {
                await _commonManager.GenerateForgotPasswordEmail(model);
                return Ok(new JObject
                {
                    ["status"] = "Success"
                }.ToString());
            }
            catch (GenericException ex)
            {
                return Ok(new JObject
                {
                    ["error"] = ex.Code
                }.ToString());
            }
            catch (Exception ex)
            {
                return Ok(new JObject
                {
                    ["error"] = ex.Message,
                    ["stackTrace"] = ex.StackTrace
                }.ToString());
            }
        }

        [HttpPost]
        [Route("ResetPassword")]
        public async Task<ActionResult> ResetPassword([FromBody] RegModel model)
        {
            try
            {

                var userId = await _commonManager.GetUserIdByValidationToken(model.VaidationToken);
                var user = await _userManager.FindByIdAsync(userId);
                var passwordHash = _userManager.PasswordHasher.HashPassword(user, model.NewPassword);
                user.PasswordHash = passwordHash;
                await _userManager.UpdateAsync(user);
                var jwt = await _jwtTokenGenerator.GenerateToken(user);
                return Ok(new JObject
                {
                    ["token"] = jwt
                }.ToString());
            }
            catch (GenericException ex)
            {
                return Ok(new JObject
                {
                    ["error"] = ex.Code
                }.ToString());
            }
            catch (Exception ex)
            {
                return Ok(new JObject
                {
                    ["error"] = ex.Message
                }.ToString());
            }
        }
    }
}
