using Mediforward.Common.Contracts;
using Mediforward.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Mediforward.Business
{
   public class SuperAdminManager : ISuperAdminManager
    {
        private ISuperAdminRepo _repo;
        public SuperAdminManager(ISuperAdminRepo repo)
        {
            _repo = repo;
        }

        public async Task<AppThemeModel> GeCurrentTheme(AppThemeModel model)
        {
            return await _repo.GeCurrentTheme(model);
        }

        public async Task<InstituteRegirstrationModel> RegisterNewInstitute(InstituteRegirstrationModel model)
        {
            return await _repo.RegisterNewInstitute(model);
        }
    }
}
