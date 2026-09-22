using System.Collections.Generic;
using MediFlow.Api.DTOs;

namespace MediFlow.Api.Extensions
{
    public static class OrderValidationExtensions
    {
        public static bool IsValid(this CreateOrderDto dto, out List<string> errors)
        {
            errors = new List<string>();
            if (dto.PharmacyId <= 0) errors.Add("PharmacyId must be greater than zero.");
            if (dto.Items == null || dto.Items.Count == 0) errors.Add("Order must contain at least one line item.");

            return errors.Count == 0;
        }

        public static bool IsValid(this CreateOrderRequestDto dto, out List<string> errors)
        {
            errors = new List<string>();
            if (dto.PharmacyId <= 0) errors.Add("PharmacyId must be greater than zero.");
            if (dto.Items == null || dto.Items.Count == 0) errors.Add("Order must contain at least one line item.");

            return errors.Count == 0;
        }
    }
}
