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
    }
}
