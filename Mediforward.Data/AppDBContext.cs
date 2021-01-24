using Mediforward.Common.Helper;
using Mediforward.Common.Identity;
using Mediforward.Data.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Mediforward.Data
{
   public class AppDBContext : IdentityDbContext<User>
    {
        public AppDBContext(DbContextOptions<AppDBContext> options)
            : base(options)
        {
           // Database.EnsureCreated();
        }

        public virtual DbSet<Institution> Institutions { get; set; } 
        public virtual DbSet<InstitutionSubscriptionPlan> InstitutionSubscriptionPlans { get; set; }
        public virtual DbSet<SubscriptionPlan> SubscriptionPlans { get; set; }
        public virtual DbSet<Address> address { get; set; }
        public virtual DbSet<Appointment> DoctorAppointments { get; set; }
        public virtual DbSet<File> Files { get; set; }
        public virtual DbSet<AppointmentPayment> AppointmentPayments { get; set; }
        public virtual DbSet<DefaultAppointmentPrice> DefaultAppointmentPrices { get; set; }
        public virtual DbSet<Provider> Providers { get; set; }
        public virtual DbSet<ProviderAvailability> ProviderAvailabilites { get; set; }
        public virtual DbSet<Speciality> Specialites { get; set; }
        public virtual DbSet<Symptom> Symptom { get; set; }
        public virtual DbSet<WaitingRoom> WaitingRooms { get; set; }
        public virtual DbSet<WaitingRoomParticipants> WaitingRoomParticipant { get; set; }
        public virtual DbSet<ProviderSpecialityMapping> ProviderSpecialityMappings { get; set; }
        public virtual DbSet<WaitingRoomElements> WaitingRoomElement { get; set; }
        public virtual DbSet<UserAddressMapping> UserAddressMappings { get; set; }
        public virtual DbSet<AppTheme> AppThemes { get; set; }
        public virtual DbSet<ThemeElements> ThemeElement { get; set; }
        public virtual DbSet<Patient> Patients { get; set; }
        public virtual DbSet<CallParticipants> CallParticipant { get; set; }
        public virtual DbSet<RoomProviderMapping> RoomProviderMapping { get; set; }
        public virtual DbSet<EmailTemplates> EmailTemplate { get; set; }

        public virtual DbSet<AppointmentOrders> Orders { get; set; }

        public virtual DbSet<DoctorNotes> Notes { get; set; }
        public virtual DbSet<ForgotPasswordValidationKey> ForgotPasswordToken { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<Institution>().Property(e => e.Id).HasColumnName("InstitutionId");
            builder.Entity<Institution>().Property(e => e.Status).HasDefaultValue("Created");
            builder.Entity<DefaultAppointmentPrice>().ToTable("DefaultAppointmentPrice").Property(e => e.Currency).HasDefaultValue("INR");
            builder.Entity<CallParticipants>().ToTable("CallParticipants").Property(e => e.Status).HasDefaultValue("A");
            builder.Entity<Provider>().Property(e => e.FirstTimeSignInComplete).HasDefaultValue("Y");
            DataSeed.Initialize(builder);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            //if (!optionsBuilder.IsConfigured)
            //{
            optionsBuilder.UseSqlServer(ConfigurationManager.AppSetting.DbConnectionString);
            //}
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var entries = ChangeTracker
                .Entries()
                .Where(e =>
                        e.State == EntityState.Added
                        || e.State == EntityState.Modified);

            foreach (var entityEntry in entries)
            {
         
                if(entityEntry.Entity.GetType().GetProperty("UpdatedDate")!= null)
                {
                    entityEntry.Entity.GetType().GetProperty("UpdatedDate").SetValue(entityEntry.Entity,DateTime.Now);
                }

                if (entityEntry.State == EntityState.Added)
                {
                    if (entityEntry.Entity.GetType().GetProperty("AddedDate") != null)
                    {
                        entityEntry.Entity.GetType().GetProperty("AddedDate").SetValue(entityEntry.Entity, DateTime.Now);
                    }
                }
            }

            return await base.SaveChangesAsync();
        }



    }
}
