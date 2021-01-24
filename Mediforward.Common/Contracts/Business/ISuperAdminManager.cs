using Mediforward.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Mediforward.Common.Contracts
{
   public interface ISuperAdminManager
    {
        Task<InstituteRegirstrationModel> RegisterNewInstitute(InstituteRegirstrationModel model);
        Task<AppThemeModel> GeCurrentTheme(AppThemeModel model);
    }
}
