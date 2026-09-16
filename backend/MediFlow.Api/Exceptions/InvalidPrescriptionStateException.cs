using System;

namespace MediFlow.Api.Exceptions
{
    public class InvalidPrescriptionStateException : Exception
    {
        public InvalidPrescriptionStateException(int prescriptionId, string currentStatus)
            : base($"Prescription '{prescriptionId}' cannot be processed in its current status: '{currentStatus}'.") { }
    }
}
