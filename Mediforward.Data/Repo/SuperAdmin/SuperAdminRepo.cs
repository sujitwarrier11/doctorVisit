using Mediforward.Common;
using Mediforward.Common.Contracts;
using Mediforward.Common.Identity;
using Mediforward.Data.Entities;
using Mediforward.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mediforward.Data
{
    public class SuperAdminRepo : ISuperAdminRepo
    {
        private readonly AppDBContext _dbContext;
        private readonly UserManager<User> _userManager;
        private readonly IJwtTokenGenerator _jwtTokenGenerator;

        public SuperAdminRepo(AppDBContext dBContext, UserManager<User> userManager, IJwtTokenGenerator jwtTokenGenerator)
        {
            _dbContext = dBContext;
            _userManager = userManager;
            _jwtTokenGenerator = jwtTokenGenerator;
        }

        public async Task<InstituteRegirstrationModel> RegisterNewInstitute(InstituteRegirstrationModel model)
        {

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
                SmsNotification = true,
            };
            var emailExists = await _userManager.FindByEmailAsync(model.Email);
            if (emailExists != null)
                throw new ValidationException("Email Already exists.");
            var result = await _userManager.CreateAsync(userDetails, model.Password);
            if (!result.Succeeded)
                throw new ValidationException("Registration failed.");
            await _userManager.AddToRoleAsync(userDetails, "admin");
            string jwt = await _jwtTokenGenerator.GenerateToken(userDetails);
            model.Token = jwt;
            Institution objInstitution = new Institution
            {
                InstituteName = model.InstituteName,
                Hostnames = model.Hostname,
                IdNumber = model.IdNumber,
                IdType = model.IdType,
                Status = "Active",
                AdministratorId = userDetails.Id,
                Type = (InstitutionType)model.InstitutionType
        };
             _dbContext.Institutions.Add(objInstitution);
            await _dbContext.SaveChangesAsync();
            return model;
        }

        public async Task<InstitutionModel> GetInstituteDetails(int InstituteId)
        {
            var Institute = await _dbContext.Institutions.Where(item => item.Id == InstituteId).FirstOrDefaultAsync();
            var Institution = new InstitutionModel { 
                InstitutionName = Institute.InstituteName
            };
            var Providers = await _dbContext.Providers.Where(item => item.InstituteId == Institute.Id).ToListAsync();
            List<KeyValuePair<string, string>> mappings = new List<KeyValuePair<string, string>>
                {
                    new KeyValuePair<string, string>("Id","ProviderId")
                };
            foreach (Provider p in Providers)
            {
                Institution.Providers.Add(p.MapTo<ProviderModel>(mappings: mappings));
            }
            return Institution;
        }

        public async Task ChangeInstituteStatus(InstitutionModel model)
        {
            var Institute = await _dbContext.Institutions.Where(item => item.Id == model.InstitutionId).FirstOrDefaultAsync();
            Institute.Status = model.Status;
            await _dbContext.SaveChangesAsync();
        }

        public async Task<AppThemeModel> GeCurrentTheme(AppThemeModel model)
        {
            var theme = await _dbContext.AppThemes.Where(item => item.HostName == model.HostName).FirstOrDefaultAsync();
            if(theme == null)
                theme = _dbContext.AppThemes.Where(item => item.HostName == "default").FirstOrDefault();
            var themeElements = await _dbContext.ThemeElement.Where(item => item.ThemeId == theme.Id).ToListAsync();    
            foreach(ThemeElements te in themeElements)
            {
                var elem = te.MapTo<ThemeElementModel>();
                elem.Type = te.Type.ToString();
                model.Elements.Add(elem);
            }
            return model;
        }


        
    }
}
