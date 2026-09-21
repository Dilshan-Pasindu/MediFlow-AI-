using Xunit;
using MediFlow.Api.DTOs;

namespace MediFlow.Tests
{
    public class PrescriptionDtoMappingTests
    {
        [Fact]
        public void CreatePrescriptionDto_MapsPropertiesCorrectly()
        {
            var dto = new CreatePrescriptionDto
            {
                PatientId = 5,
                PharmacyId = 2,
                Notes = "Take after meals"
            };

            Assert.Equal(5, dto.PatientId);
            Assert.Equal(2, dto.PharmacyId);
            Assert.Equal("Take after meals", dto.Notes);
        }
    
        [Fact]
        public void UpdatePrescriptionRequestDto_InitializesWithCorrectValues()
        {
            var dto = new UpdatePrescriptionRequestDto(
                PatientName: "Jane Doe",
                IsWalkIn: false,
                WalkInPatientDetails: null,
                Diagnosis: "Acute Bronchitis",
                FulfillmentSource: "InHouse",
                Instructions: "Rest and hydration",
                Items: null
            );

            Assert.Equal("Jane Doe", dto.PatientName);
            Assert.Equal("Acute Bronchitis", dto.Diagnosis);
            Assert.Equal("InHouse", dto.FulfillmentSource);
            Assert.Equal("Rest and hydration", dto.Instructions);
        }

    }
}
