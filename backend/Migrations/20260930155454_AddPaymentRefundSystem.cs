using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace MediFlow.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddPaymentRefundSystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "TransactionReference",
                table: "AppointmentPayments",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CancelledAt",
                table: "AppointmentPayments",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Currency",
                table: "AppointmentPayments",
                type: "character varying(10)",
                maxLength: 10,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "FailedAt",
                table: "AppointmentPayments",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Metadata",
                table: "AppointmentPayments",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PatientId",
                table: "AppointmentPayments",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Provider",
                table: "AppointmentPayments",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProviderOrderId",
                table: "AppointmentPayments",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProviderPaymentId",
                table: "AppointmentPayments",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "RefundedAt",
                table: "AppointmentPayments",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AppointmentRefunds",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PaymentId = table.Column<int>(type: "integer", nullable: false),
                    AppointmentId = table.Column<int>(type: "integer", nullable: false),
                    PatientId = table.Column<int>(type: "integer", nullable: false),
                    Amount = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    Currency = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    Reason = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    AdditionalNotes = table.Column<string>(type: "text", nullable: true),
                    Status = table.Column<string>(type: "text", nullable: false),
                    RequestedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ApprovedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    RejectedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ProcessingAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CompletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    FailedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ApprovedByUserId = table.Column<int>(type: "integer", nullable: true),
                    AdminNotes = table.Column<string>(type: "text", nullable: true),
                    RejectionReason = table.Column<string>(type: "text", nullable: true),
                    ProviderRefundId = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    RefundReference = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    FailureReason = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppointmentRefunds", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppointmentRefunds_AppointmentPayments_PaymentId",
                        column: x => x.PaymentId,
                        principalTable: "AppointmentPayments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AppointmentRefunds_Appointments_AppointmentId",
                        column: x => x.AppointmentId,
                        principalTable: "Appointments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AppointmentRefunds_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PaymentAuditLogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AppointmentId = table.Column<int>(type: "integer", nullable: true),
                    PaymentId = table.Column<int>(type: "integer", nullable: true),
                    RefundId = table.Column<int>(type: "integer", nullable: true),
                    UserId = table.Column<int>(type: "integer", nullable: true),
                    UserRole = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    Action = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Result = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    Details = table.Column<string>(type: "text", nullable: true),
                    ProviderReference = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PaymentAuditLogs", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppointmentPayments_ProviderPaymentId",
                table: "AppointmentPayments",
                column: "ProviderPaymentId");

            migrationBuilder.CreateIndex(
                name: "IX_AppointmentPayments_TransactionReference",
                table: "AppointmentPayments",
                column: "TransactionReference");

            migrationBuilder.CreateIndex(
                name: "IX_AppointmentRefunds_AppointmentId",
                table: "AppointmentRefunds",
                column: "AppointmentId");

            migrationBuilder.CreateIndex(
                name: "IX_AppointmentRefunds_PatientId",
                table: "AppointmentRefunds",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_AppointmentRefunds_PaymentId",
                table: "AppointmentRefunds",
                column: "PaymentId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PaymentAuditLogs_AppointmentId",
                table: "PaymentAuditLogs",
                column: "AppointmentId");

            migrationBuilder.CreateIndex(
                name: "IX_PaymentAuditLogs_CreatedAt",
                table: "PaymentAuditLogs",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_PaymentAuditLogs_PaymentId",
                table: "PaymentAuditLogs",
                column: "PaymentId");

            migrationBuilder.CreateIndex(
                name: "IX_PaymentAuditLogs_RefundId",
                table: "PaymentAuditLogs",
                column: "RefundId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppointmentRefunds");

            migrationBuilder.DropTable(
                name: "PaymentAuditLogs");

            migrationBuilder.DropIndex(
                name: "IX_AppointmentPayments_ProviderPaymentId",
                table: "AppointmentPayments");

            migrationBuilder.DropIndex(
                name: "IX_AppointmentPayments_TransactionReference",
                table: "AppointmentPayments");

            migrationBuilder.DropColumn(
                name: "CancelledAt",
                table: "AppointmentPayments");

            migrationBuilder.DropColumn(
                name: "Currency",
                table: "AppointmentPayments");

            migrationBuilder.DropColumn(
                name: "FailedAt",
                table: "AppointmentPayments");

            migrationBuilder.DropColumn(
                name: "Metadata",
                table: "AppointmentPayments");

            migrationBuilder.DropColumn(
                name: "PatientId",
                table: "AppointmentPayments");

            migrationBuilder.DropColumn(
                name: "Provider",
                table: "AppointmentPayments");

            migrationBuilder.DropColumn(
                name: "ProviderOrderId",
                table: "AppointmentPayments");

            migrationBuilder.DropColumn(
                name: "ProviderPaymentId",
                table: "AppointmentPayments");

            migrationBuilder.DropColumn(
                name: "RefundedAt",
                table: "AppointmentPayments");

            migrationBuilder.AlterColumn<string>(
                name: "TransactionReference",
                table: "AppointmentPayments",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(200)",
                oldMaxLength: 200,
                oldNullable: true);
        }
    }
}
