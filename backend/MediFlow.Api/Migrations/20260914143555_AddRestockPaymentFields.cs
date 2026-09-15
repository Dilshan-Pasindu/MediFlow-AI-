using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MediFlow.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddRestockPaymentFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PaymentSlipUrl",
                table: "RestockRequests",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PaymentStatus",
                table: "RestockRequests",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SupplierAccountName",
                table: "RestockRequests",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SupplierAccountNumber",
                table: "RestockRequests",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SupplierBankName",
                table: "RestockRequests",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SupplierBranch",
                table: "RestockRequests",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PaymentSlipUrl",
                table: "RestockRequests");

            migrationBuilder.DropColumn(
                name: "PaymentStatus",
                table: "RestockRequests");

            migrationBuilder.DropColumn(
                name: "SupplierAccountName",
                table: "RestockRequests");

            migrationBuilder.DropColumn(
                name: "SupplierAccountNumber",
                table: "RestockRequests");

            migrationBuilder.DropColumn(
                name: "SupplierBankName",
                table: "RestockRequests");

            migrationBuilder.DropColumn(
                name: "SupplierBranch",
                table: "RestockRequests");
        }
    }
}
