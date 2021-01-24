using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Mediforward.Data.Migrations
{
    public partial class Initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "address",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UpdatedBy = table.Column<string>(nullable: true),
                    UpdatedDate = table.Column<DateTime>(nullable: true),
                    AddedBy = table.Column<string>(nullable: true),
                    AddedDate = table.Column<DateTime>(nullable: false),
                    AddressType = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    AddressLine1 = table.Column<string>(maxLength: 120, nullable: false),
                    AddressLine2 = table.Column<string>(maxLength: 120, nullable: true),
                    City = table.Column<string>(maxLength: 60, nullable: false),
                    State = table.Column<string>(maxLength: 60, nullable: false),
                    Country = table.Column<string>(maxLength: 60, nullable: false),
                    Pincode = table.Column<string>(maxLength: 12, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_address", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AppThemes",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UpdatedBy = table.Column<string>(nullable: true),
                    UpdatedDate = table.Column<DateTime>(nullable: true),
                    AddedBy = table.Column<string>(nullable: true),
                    AddedDate = table.Column<DateTime>(nullable: false),
                    InstitutionId = table.Column<int>(nullable: false),
                    IsActive = table.Column<bool>(nullable: false),
                    IsDefault = table.Column<bool>(nullable: false),
                    HostName = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppThemes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    Name = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    UserName = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(maxLength: 256, nullable: true),
                    Email = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(nullable: false),
                    PasswordHash = table.Column<string>(nullable: true),
                    SecurityStamp = table.Column<string>(nullable: true),
                    ConcurrencyStamp = table.Column<string>(nullable: true),
                    PhoneNumber = table.Column<string>(nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(nullable: false),
                    TwoFactorEnabled = table.Column<bool>(nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(nullable: true),
                    LockoutEnabled = table.Column<bool>(nullable: false),
                    AccessFailedCount = table.Column<int>(nullable: false),
                    FirstName = table.Column<string>(nullable: true),
                    LastName = table.Column<string>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    CreatedBy = table.Column<Guid>(nullable: false),
                    SmsNotification = table.Column<bool>(nullable: false),
                    EmailNotification = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CallParticipants",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UpdatedBy = table.Column<string>(nullable: true),
                    UpdatedDate = table.Column<DateTime>(nullable: true),
                    AddedBy = table.Column<string>(nullable: true),
                    AddedDate = table.Column<DateTime>(nullable: false),
                    AppointmentId = table.Column<int>(nullable: false),
                    Role = table.Column<string>(nullable: true),
                    SocketId = table.Column<string>(nullable: true),
                    ParticipantId = table.Column<int>(nullable: false),
                    RoomId = table.Column<int>(nullable: false),
                    Status = table.Column<string>(nullable: true, defaultValue: "A")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CallParticipants", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DefaultAppointmentPrice",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UpdatedBy = table.Column<string>(nullable: true),
                    UpdatedDate = table.Column<DateTime>(nullable: true),
                    AddedBy = table.Column<string>(nullable: true),
                    AddedDate = table.Column<DateTime>(nullable: false),
                    UserId = table.Column<int>(nullable: false),
                    AppointmentBasePrice = table.Column<decimal>(type: "money", nullable: true),
                    Currency = table.Column<string>(nullable: true, defaultValue: "INR")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DefaultAppointmentPrice", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DoctorAppointments",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UpdatedBy = table.Column<string>(nullable: true),
                    UpdatedDate = table.Column<DateTime>(nullable: true),
                    AddedBy = table.Column<string>(nullable: true),
                    AddedDate = table.Column<DateTime>(nullable: false),
                    ProviderId = table.Column<int>(nullable: false),
                    PatientId = table.Column<int>(nullable: false),
                    appointmentStatus = table.Column<int>(nullable: false),
                    appointmentType = table.Column<int>(nullable: false),
                    StartTime = table.Column<DateTime>(nullable: true),
                    EndTime = table.Column<DateTime>(nullable: true),
                    RoomSID = table.Column<string>(nullable: true),
                    RoomName = table.Column<string>(nullable: true),
                    RoomId = table.Column<int>(nullable: false),
                    paymentStatus = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DoctorAppointments", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "EmailTemplate",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UpdatedBy = table.Column<string>(nullable: true),
                    UpdatedDate = table.Column<DateTime>(nullable: true),
                    AddedBy = table.Column<string>(nullable: true),
                    AddedDate = table.Column<DateTime>(nullable: false),
                    TemplateType = table.Column<string>(nullable: true),
                    TemplateContent = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmailTemplate", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Files",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UpdatedBy = table.Column<string>(nullable: true),
                    UpdatedDate = table.Column<DateTime>(nullable: true),
                    AddedBy = table.Column<string>(nullable: true),
                    AddedDate = table.Column<DateTime>(nullable: false),
                    AppointmentId = table.Column<int>(nullable: true),
                    RoomId = table.Column<int>(nullable: true),
                    FileName = table.Column<string>(nullable: true),
                    Extension = table.Column<string>(nullable: true),
                    Path = table.Column<string>(nullable: true),
                    SharedBy = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Files", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Institutions",
                columns: table => new
                {
                    InstitutionId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UpdatedBy = table.Column<string>(nullable: true),
                    UpdatedDate = table.Column<DateTime>(nullable: true),
                    AddedBy = table.Column<string>(nullable: true),
                    AddedDate = table.Column<DateTime>(nullable: false),
                    InstituteName = table.Column<string>(nullable: true),
                    Status = table.Column<string>(nullable: true, defaultValue: "Created"),
                    AdministratorId = table.Column<string>(nullable: true),
                    Hostnames = table.Column<string>(maxLength: 2000, nullable: true),
                    IdType = table.Column<string>(nullable: true),
                    IdNumber = table.Column<string>(nullable: true),
                    Type = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Institutions", x => x.InstitutionId);
                });

            migrationBuilder.CreateTable(
                name: "InstitutionSubscriptionPlans",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UpdatedBy = table.Column<string>(nullable: true),
                    UpdatedDate = table.Column<DateTime>(nullable: true),
                    AddedBy = table.Column<string>(nullable: true),
                    AddedDate = table.Column<DateTime>(nullable: false),
                    UserId = table.Column<int>(nullable: false),
                    SubscriptionPlanId = table.Column<int>(nullable: false),
                    StartDate = table.Column<DateTime>(nullable: true),
                    EndDate = table.Column<DateTime>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InstitutionSubscriptionPlans", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UpdatedBy = table.Column<string>(nullable: true),
                    UpdatedDate = table.Column<DateTime>(nullable: true),
                    AddedBy = table.Column<string>(nullable: true),
                    AddedDate = table.Column<DateTime>(nullable: false),
                    RazorPayOrderId = table.Column<string>(nullable: true),
                    Amount = table.Column<decimal>(type: "money", nullable: false),
                    AppointmentId = table.Column<int>(nullable: false),
                    PayeeId = table.Column<int>(nullable: false),
                    PaymentStatus = table.Column<string>(nullable: true),
                    TransactionId = table.Column<string>(nullable: true),
                    ReceiptId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Patients",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UpdatedBy = table.Column<string>(nullable: true),
                    UpdatedDate = table.Column<DateTime>(nullable: true),
                    AddedBy = table.Column<string>(nullable: true),
                    AddedDate = table.Column<DateTime>(nullable: false),
                    FirstName = table.Column<string>(nullable: true),
                    LastName = table.Column<string>(nullable: true),
                    Email = table.Column<string>(nullable: true),
                    PhoneNumber = table.Column<string>(nullable: true),
                    UserId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Patients", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ProviderAvailabilites",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UpdatedBy = table.Column<string>(nullable: true),
                    UpdatedDate = table.Column<DateTime>(nullable: true),
                    AddedBy = table.Column<string>(nullable: true),
                    AddedDate = table.Column<DateTime>(nullable: false),
                    ProviderId = table.Column<int>(nullable: false),
                    AvailableFromDate = table.Column<DateTime>(nullable: true),
                    AvailableToDate = table.Column<DateTime>(nullable: true),
                    CronExpression = table.Column<string>(nullable: true),
                    Type = table.Column<string>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProviderAvailabilites", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Providers",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Salutation = table.Column<string>(nullable: true),
                    PhotoId = table.Column<long>(nullable: true),
                    MedicalLicenceNumber = table.Column<string>(nullable: true),
                    UserId = table.Column<string>(nullable: true),
                    Active = table.Column<bool>(nullable: false),
                    Deleted = table.Column<bool>(nullable: false),
                    UpdatedBy = table.Column<string>(nullable: true),
                    UpdatedDate = table.Column<DateTime>(nullable: true),
                    AddedBy = table.Column<string>(nullable: true),
                    AddedDate = table.Column<DateTime>(nullable: false),
                    InstituteId = table.Column<int>(nullable: false),
                    SocketId = table.Column<string>(nullable: true),
                    Speciality = table.Column<string>(nullable: true),
                    DisplayName = table.Column<string>(nullable: true),
                    Position = table.Column<string>(nullable: true),
                    ProfilePicture = table.Column<string>(nullable: true),
                    DashboardCamEnabled = table.Column<bool>(nullable: false),
                    FirstTimeSignInComplete = table.Column<string>(nullable: true, defaultValue: "Y"),
                    Language = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Providers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ProviderSpecialityMappings",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UpdatedBy = table.Column<string>(nullable: true),
                    UpdatedDate = table.Column<DateTime>(nullable: true),
                    AddedBy = table.Column<string>(nullable: true),
                    AddedDate = table.Column<DateTime>(nullable: false),
                    ProviderId = table.Column<int>(nullable: false),
                    SpecialityId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProviderSpecialityMappings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RoomProviderMapping",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UpdatedBy = table.Column<string>(nullable: true),
                    UpdatedDate = table.Column<DateTime>(nullable: true),
                    AddedBy = table.Column<string>(nullable: true),
                    AddedDate = table.Column<DateTime>(nullable: false),
                    RoomId = table.Column<int>(nullable: false),
                    ProviderId = table.Column<int>(nullable: false),
                    IsPrimaryOwner = table.Column<bool>(nullable: false),
                    SocketId = table.Column<string>(nullable: true),
                    IsActive = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoomProviderMapping", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Specialites",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UpdatedBy = table.Column<string>(nullable: true),
                    UpdatedDate = table.Column<DateTime>(nullable: true),
                    AddedBy = table.Column<string>(nullable: true),
                    AddedDate = table.Column<DateTime>(nullable: false),
                    SpecialityName = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Specialites", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SubscriptionPlans",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UpdatedBy = table.Column<string>(nullable: true),
                    UpdatedDate = table.Column<DateTime>(nullable: true),
                    AddedBy = table.Column<string>(nullable: true),
                    AddedDate = table.Column<DateTime>(nullable: false),
                    SubscriptionPlanName = table.Column<string>(nullable: true),
                    SubscriptionDuration = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SubscriptionPlans", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Symptom",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UpdatedBy = table.Column<string>(nullable: true),
                    UpdatedDate = table.Column<DateTime>(nullable: true),
                    AddedBy = table.Column<string>(nullable: true),
                    AddedDate = table.Column<DateTime>(nullable: false),
                    SymptomName = table.Column<string>(nullable: true),
                    SpecialityId = table.Column<int>(nullable: false),
                    GroupName = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Symptom", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ThemeElement",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UpdatedBy = table.Column<string>(nullable: true),
                    UpdatedDate = table.Column<DateTime>(nullable: true),
                    AddedBy = table.Column<string>(nullable: true),
                    AddedDate = table.Column<DateTime>(nullable: false),
                    ThemeId = table.Column<int>(nullable: false),
                    Type = table.Column<int>(nullable: false),
                    Content = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ThemeElement", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserAddressMappings",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UpdatedBy = table.Column<string>(nullable: true),
                    UpdatedDate = table.Column<DateTime>(nullable: true),
                    AddedBy = table.Column<string>(nullable: true),
                    AddedDate = table.Column<DateTime>(nullable: false),
                    UserId = table.Column<string>(nullable: true),
                    AddressId = table.Column<int>(nullable: false),
                    IsActive = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserAddressMappings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "WaitingRoomElement",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UpdatedBy = table.Column<string>(nullable: true),
                    UpdatedDate = table.Column<DateTime>(nullable: true),
                    AddedBy = table.Column<string>(nullable: true),
                    AddedDate = table.Column<DateTime>(nullable: false),
                    WaitingRoomId = table.Column<int>(nullable: false),
                    ElementType = table.Column<string>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    Content = table.Column<string>(nullable: true),
                    Position = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WaitingRoomElement", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "WaitingRoomParticipant",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UpdatedBy = table.Column<string>(nullable: true),
                    UpdatedDate = table.Column<DateTime>(nullable: true),
                    AddedBy = table.Column<string>(nullable: true),
                    AddedDate = table.Column<DateTime>(nullable: false),
                    WaitingRoomId = table.Column<int>(nullable: false),
                    PatientId = table.Column<int>(nullable: false),
                    LastPing = table.Column<DateTime>(nullable: false),
                    IsConnected = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WaitingRoomParticipant", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "WaitingRooms",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UpdatedBy = table.Column<string>(nullable: true),
                    UpdatedDate = table.Column<DateTime>(nullable: true),
                    AddedBy = table.Column<string>(nullable: true),
                    AddedDate = table.Column<DateTime>(nullable: false),
                    ProviderId = table.Column<int>(nullable: false),
                    RoomCode = table.Column<string>(nullable: true),
                    RoomName = table.Column<string>(nullable: true),
                    IsActive = table.Column<bool>(nullable: false),
                    UsePasscode = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WaitingRooms", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleId = table.Column<string>(nullable: false),
                    ClaimType = table.Column<string>(nullable: true),
                    ClaimValue = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(nullable: false),
                    ClaimType = table.Column<string>(nullable: true),
                    ClaimValue = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(nullable: false),
                    ProviderKey = table.Column<string>(nullable: false),
                    ProviderDisplayName = table.Column<string>(nullable: true),
                    UserId = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<string>(nullable: false),
                    RoleId = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<string>(nullable: false),
                    LoginProvider = table.Column<string>(nullable: false),
                    Name = table.Column<string>(nullable: false),
                    Value = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AppointmentPayments",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UpdatedBy = table.Column<string>(nullable: true),
                    UpdatedDate = table.Column<DateTime>(nullable: true),
                    AddedBy = table.Column<string>(nullable: true),
                    AddedDate = table.Column<DateTime>(nullable: false),
                    appointmentId = table.Column<int>(nullable: true),
                    Amount = table.Column<decimal>(type: "money", nullable: false),
                    TransactionId = table.Column<string>(nullable: true),
                    transactionStatus = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppointmentPayments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppointmentPayments_DoctorAppointments_appointmentId",
                        column: x => x.appointmentId,
                        principalTable: "DoctorAppointments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "AppThemes",
                columns: new[] { "Id", "AddedBy", "AddedDate", "HostName", "InstitutionId", "IsActive", "IsDefault", "UpdatedBy", "UpdatedDate" },
                values: new object[] { 1, null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "default", 0, false, true, null, null });

            migrationBuilder.InsertData(
                table: "EmailTemplate",
                columns: new[] { "Id", "AddedBy", "AddedDate", "TemplateContent", "TemplateType", "UpdatedBy", "UpdatedDate" },
                values: new object[] { 1, null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), @"
                    <!DOCTYPE html PUBLIC ""-//W3C//DTD XHTML 1.0 Transitional//EN"" ""https://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"">
                     <html xmlns=""https://www.w3.org/1999/xhtml"">
                      <head>
                        <title>Invitation</title>
                        <meta http–equiv=""Content-Type"" content=""text/html; charset=UTF-8"" />
                        <meta http–equiv=""X-UA-Compatible"" content=""IE=edge"" />
                        <meta name=""viewport"" content=""width=device-width, initial-scale=1.0 "" />
                     </head>
                     <body style=""margin:0px; padding:0px;"" >
                         <div style=""display: flex; box-sizing: border-box; flex-direction: column; align-items: center; justify-content: center; background-color: {0}; width:100%;"">
                            <div style=""margin: auto; background-color: {1}; box-sizing: border-box; width: 70%; padding: 20px;"">
                              <div style=""display: flex; box-sizing: border-box; flex-direction: column; align-items: center; justify-content: center; border-bottom: {2};"">
                                <img src=""{3}"" height=""95"" width = ""140"" />
                              </div>
                              <div style=""display: block; box-sizing: border-box; flex-direction: column; align-items: center; justify-content: center;"">
                                <p>Hello,{4} has invited you to join a secure video call:</p>
                                <p><a href=""{5}"">{5}</a> </p>
                                <p> Make sure you are using a device with good internet connection and access to camera/audio. If you need any assistance please contact your provider directly.</p>
                              </div>
                           </div>
                         </div>   
                    </body>", "RoomInvite", null, null });

            migrationBuilder.InsertData(
                table: "Specialites",
                columns: new[] { "Id", "AddedBy", "AddedDate", "SpecialityName", "UpdatedBy", "UpdatedDate" },
                values: new object[,]
                {
                    { 28, null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Oncology", null, null },
                    { 27, null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Pharmacy", null, null },
                    { 26, null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Urology", null, null },
                    { 25, null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Rheumatology", null, null },
                    { 24, null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Pulmomology", null, null },
                    { 23, null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Podiatry", null, null },
                    { 22, null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Plastic Surgery", null, null },
                    { 21, null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Pediatrics", null, null },
                    { 20, null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Otolaryngology", null, null },
                    { 18, null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Optometry", null, null },
                    { 17, null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Opthamology", null, null },
                    { 16, null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Obstetrics And Gynecology", null, null },
                    { 15, null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Neurology", null, null },
                    { 19, null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Orthopedic Surgery", null, null },
                    { 13, null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Integrative Medicine", null, null },
                    { 1, null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Allergy", null, null },
                    { 14, null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Internal Medicine", null, null },
                    { 3, null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Cardiology", null, null },
                    { 4, null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Cardiothorasic Surgery", null, null },
                    { 5, null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Chiropractic Medicine", null, null },
                    { 6, null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Dermatology", null, null },
                    { 2, null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Audiology", null, null },
                    { 8, null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Family Medicine", null, null },
                    { 9, null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Gastroenterology", null, null },
                    { 10, null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "General Surgery", null, null },
                    { 11, null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Hematology And Oncology", null, null },
                    { 12, null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Infectious Diseases", null, null },
                    { 7, null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Endocrinology", null, null }
                });

            migrationBuilder.InsertData(
                table: "ThemeElement",
                columns: new[] { "Id", "AddedBy", "AddedDate", "Content", "ThemeId", "Type", "UpdatedBy", "UpdatedDate" },
                values: new object[,]
                {
                    { 10, null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "14px", 1, 12, null, null },
                    { 9, null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "#5f6a7d", 1, 11, null, null },
                    { 8, null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "32px", 1, 10, null, null },
                    { 7, null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "#000", 1, 9, null, null },
                    { 6, null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "#737373", 1, 8, null, null },
                    { 3, null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "#029ba7", 1, 5, null, null },
                    { 4, null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "#fff", 1, 6, null, null },
                    { 2, null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "#f4f6f5", 1, 4, null, null },
                    { 1, null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "/static/defaultTheme/logo.png", 1, 0, null, null },
                    { 11, null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "12px", 1, 13, null, null },
                    { 5, null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "ProximaNova,Helvetica Neue,Helvetica,Arial,sans-serif", 1, 7, null, null },
                    { 12, null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "14px", 1, 14, null, null }
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppointmentPayments_appointmentId",
                table: "AppointmentPayments",
                column: "appointmentId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true,
                filter: "[NormalizedName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true,
                filter: "[NormalizedUserName] IS NOT NULL");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "address");

            migrationBuilder.DropTable(
                name: "AppointmentPayments");

            migrationBuilder.DropTable(
                name: "AppThemes");

            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "CallParticipants");

            migrationBuilder.DropTable(
                name: "DefaultAppointmentPrice");

            migrationBuilder.DropTable(
                name: "EmailTemplate");

            migrationBuilder.DropTable(
                name: "Files");

            migrationBuilder.DropTable(
                name: "Institutions");

            migrationBuilder.DropTable(
                name: "InstitutionSubscriptionPlans");

            migrationBuilder.DropTable(
                name: "Orders");

            migrationBuilder.DropTable(
                name: "Patients");

            migrationBuilder.DropTable(
                name: "ProviderAvailabilites");

            migrationBuilder.DropTable(
                name: "Providers");

            migrationBuilder.DropTable(
                name: "ProviderSpecialityMappings");

            migrationBuilder.DropTable(
                name: "RoomProviderMapping");

            migrationBuilder.DropTable(
                name: "Specialites");

            migrationBuilder.DropTable(
                name: "SubscriptionPlans");

            migrationBuilder.DropTable(
                name: "Symptom");

            migrationBuilder.DropTable(
                name: "ThemeElement");

            migrationBuilder.DropTable(
                name: "UserAddressMappings");

            migrationBuilder.DropTable(
                name: "WaitingRoomElement");

            migrationBuilder.DropTable(
                name: "WaitingRoomParticipant");

            migrationBuilder.DropTable(
                name: "WaitingRooms");

            migrationBuilder.DropTable(
                name: "DoctorAppointments");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "AspNetUsers");
        }
    }
}
