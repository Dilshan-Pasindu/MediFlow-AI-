using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MediFlow.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddPatientAllergies : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Allergies",
                table: "Patients",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Allergies",
                table: "Patients");
        }
    }
}
