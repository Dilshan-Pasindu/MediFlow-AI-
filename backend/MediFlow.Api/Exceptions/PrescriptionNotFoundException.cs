using System;

namespace MediFlow.Api.Exceptions
{
    public class PrescriptionNotFoundException : Exception
    {
        public PrescriptionNotFoundException(int prescriptionId)
            : base($"Prescription with ID '{prescriptionId}' was not found.") { }
    }
}
