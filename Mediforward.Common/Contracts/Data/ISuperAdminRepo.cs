using Mediforward.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Mediforward.Common.Contracts
{
   public interface ISuperAdminRepo
    {
        Task<InstituteRegirstrationModel> RegisterNewInstitute(InstituteRegirstrationModel model);
        Task<AppThemeModel> GeCurrentTheme(AppThemeModel model);
    }
}
