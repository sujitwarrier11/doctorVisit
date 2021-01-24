using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Mediforward.Common.Contracts;
using Mediforward;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Mediforward.Models;
using Mediforward.Common;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Mediforward.Common.Identity;

namespace Mediforward.Service.Controllers.Admin
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private ISuperAdminManager _manager;
        private readonly IProviderManager _providerManager;
        private readonly IEmailService _emailService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly UserManager<User> _userManager;
        public AdminController(ISuperAdminManager manager, IProviderManager providerManager, IEmailService emailService, IHttpContextAccessor httpContextAccessor, UserManager<User> userManager)
        {
            _manager = manager;
            _providerManager = providerManager;
            _emailService = emailService;
            _httpContextAccessor = httpContextAccessor;
            _userManager = userManager;
        }

        [Authorize(Roles = "admin")]
        [HttpPost]
        [Route("RegisterInstitute")]
        public async Task<InstituteRegirstrationModel> RegisterInstitute([FromBody] InstituteRegirstrationModel model)
        {
            try
            {
                return await _manager.RegisterNewInstitute(model);

            }
            catch (GenericException ex)
            {
                return new InstituteRegirstrationModel
                {
                    error = ex.Code
                };
            }
            catch (Exception ex)
            {
                return new InstituteRegirstrationModel
                {
                    error = ex.Message,
                    stackTrace = ex.StackTrace
                };
            }
        }

        [HttpPost]
        [Route("GetTheme")]
        public async Task<AppThemeModel> GetCurrentTheme([FromBody] AppThemeModel model)
        {
            try
            {
                return await _manager.GeCurrentTheme(model);
            }
            catch (GenericException ex)
            {
                return new AppThemeModel
                {
                    error = ex.Code
                };
            }
            catch (Exception ex)
            {
                return new AppThemeModel
                {
                    error = ex.Message,
                    stackTrace = ex.StackTrace
                };
            }
        }

        [Authorize(Roles = "admin")]
        [HttpPost]
        [Route("RegisterNewDoctor")]
        public async Task<InstituteUserModel> RegisterNewDoctor([FromBody] ProviderModel model)
        {
            try
            {
                model.Password = GenericHelper.GenerateRandomPassword(8);
                var user = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;
                var currentProvider = await _providerManager.GetProviderDetails(user);
                model.InstituteId = currentProvider.InstituteId;
                model.FirstTimeSignInComplete = "N";
                var provider = await _providerManager.RegisterNewProvider(model, currentProvider.ProviderId);
                string message = $"Dear {model.FirstName} {model.LastName},\n Your account has been created. Your temporary password is <b>{model.Password}</b>. Please login and update your details.";
                await _emailService.SendEmail(model.Email, message, "Welcome");
                return new InstituteUserModel
                {
                    ProviderId = provider.ProviderId,
                    RoomName = model.RoomName,
                    CurrentRole = "doctor",
                    Email = model.Email,
                    Name = $"{model.FirstName} {model.LastName}"
                };
            }
            catch (GenericException ex)
            {
                return new InstituteUserModel
                {
                    error = ex.Code
                };
            }
            catch (Exception ex)
            {
                return new InstituteUserModel
                {
                    error = ex.Message,
                    stackTrace = ex.StackTrace
                };
            }
        }

        [Authorize(Roles = "admin")]
        [HttpPost]
        [Route("UpdateRole")]
        public async Task UpdateRole([FromBody] InstituteUserModel model)
        {
            try
            {
                var provider = await _providerManager.GetProviderDetailsById(model.ProviderId);
                var user = await _userManager.FindByIdAsync(provider.UserId);
                var roles = await _userManager.GetRolesAsync(user);
                await _userManager.RemoveFromRoleAsync(user, roles[0]);
                await _userManager.AddToRoleAsync(user, model.CurrentRole);
            }
            catch (GenericException ex)
            {
                Console.WriteLine($"Error Code: {ex.Code}");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }

        [Authorize(Roles = "admin")]
        [HttpPost]
        [Route("DeleteUser")]
        public async Task DeleteUser([FromBody] InstituteUserModel model)
        {
            try
            {
                var provider = await _providerManager.GetProviderDetailsById(model.ProviderId);
                var user = await _userManager.FindByIdAsync(provider.UserId);
                await _userManager.DeleteAsync(user);
            }
            catch (GenericException ex)
            {
                Console.WriteLine($"Error Code: {ex.Code}");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }


        [Authorize(Roles = "admin")]
        [HttpPost]
        [Route("GetUserStatusForRoom")]
        public async Task<List<InstituteUserModel>> GetUserStatusForRoom([FromBody] WaitingRoomModel model)
        {
            try
            {
                var user = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;
                model.UserId = user;
                var provider = await _providerManager.GetProviderDetails(user);
                model.ProviderId = provider.ProviderId;
                return await _providerManager.GetUserStatusForRoom(model);
            }
            catch (GenericException ex)
            {
                return new List<InstituteUserModel>() {
                    new InstituteUserModel{
                        error = ex.Code,
                    }
                };
            }
            catch (Exception ex)
            {
                return new List<InstituteUserModel>() {
                    new InstituteUserModel{
                        error = ex.Message,
                        stackTrace =ex.StackTrace,
                    }
                };
            }
        }

        [Authorize(Roles = "admin")]
        [HttpPost]
        [Route("AddRemoveUserFromRoom")]
        public async Task AddRemoveUserFromRoom(RoomMappingModel model)
        {
            try
            {
                await _providerManager.AddRemoveUserFromRoom(model);
            }
            catch (GenericException ex)
            {
                Console.WriteLine($"Error Code: {ex.Code}");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }
    }





}
