using System.Collections.Generic;
using MediFlow.Api.DTOs;

namespace MediFlow.Api.Extensions
{
    public static class PrescriptionValidationExtensions
    {
        public static bool IsValid(this CreatePrescriptionDto dto, out List<string> errors)
        {
            errors = new List<string>();
            if (dto.PatientId <= 0) errors.Add("PatientId must be greater than zero.");
            if (dto.PharmacyId <= 0) errors.Add("PharmacyId must be greater than zero.");
            if (dto.Items == null || dto.Items.Count == 0) errors.Add("Prescription must contain at least one item.");

            return errors.Count == 0;
        }
    }
}
