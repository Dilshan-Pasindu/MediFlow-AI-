using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MediFlow.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddSupabaseUserIdMapping : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "PasswordHash",
                table: "Users",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<string>(
                name: "SupabaseId",
                table: "Users",
                type: "character varying(128)",
                maxLength: 128,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SupabaseId",
                table: "Patients",
                type: "character varying(128)",
                maxLength: 128,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_SupabaseId",
                table: "Users",
                column: "SupabaseId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Patients_SupabaseId",
                table: "Patients",
                column: "SupabaseId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Users_SupabaseId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Patients_SupabaseId",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "SupabaseId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "SupabaseId",
                table: "Patients");

            migrationBuilder.AlterColumn<string>(
                name: "PasswordHash",
                table: "Users",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);
        }
    }
}
