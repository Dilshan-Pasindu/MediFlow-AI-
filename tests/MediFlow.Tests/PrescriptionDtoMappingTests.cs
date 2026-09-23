using System.Collections.Generic;
using Xunit;
using MediFlow.Api.DTOs;

namespace MediFlow.Tests
{
    public class PrescriptionDtoMappingTests
    {
        [Fact]
        public void CreatePrescriptionRequestDto_MapsPropertiesCorrectly()
        {
            var dto = new CreatePrescriptionRequestDto(
                AppointmentId: null,
                PatientId: 5,
                IsWalkIn: false,
                WalkInPatientDetails: null,
                PatientName: "John Doe",
                Diagnosis: "Fever",
                FulfillmentSource: "InHouse",
                Recipients: "Both",
                Instructions: "Take after meals",
                Items: new List<CreatePrescriptionItemDto>()
            );

            Assert.Equal(5, dto.PatientId);
            Assert.Equal("InHouse", dto.FulfillmentSource);
            Assert.Equal("Take after meals", dto.Instructions);
        }
    }
}
