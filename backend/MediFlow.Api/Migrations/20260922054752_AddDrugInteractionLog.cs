using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace MediFlow.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddDrugInteractionLog : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DrugInteractionLogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PrescriptionId = table.Column<int>(type: "integer", nullable: false),
                    DrugA = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    DrugB = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    WarningType = table.Column<string>(type: "text", nullable: false),
                    SeverityLevel = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    PharmacistId = table.Column<int>(type: "integer", nullable: true),
                    PharmacistOverrideNote = table.Column<string>(type: "text", nullable: true),
                    AcknowledgedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DrugInteractionLogs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DrugInteractionLogs_Prescriptions_PrescriptionId",
                        column: x => x.PrescriptionId,
                        principalTable: "Prescriptions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DrugInteractionLogs_PrescriptionId",
                table: "DrugInteractionLogs",
                column: "PrescriptionId");

            migrationBuilder.CreateIndex(
                name: "IX_DrugInteractionLogs_PrescriptionId_AcknowledgedAt",
                table: "DrugInteractionLogs",
                columns: new[] { "PrescriptionId", "AcknowledgedAt" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DrugInteractionLogs");
        }
    }
}
