import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { type DigitalSignature } from "@shared/schema";

type DigitalSignaturesResponse = { success: boolean; signatures: DigitalSignature[] };

export function useDigitalSignatures(userId: string) {
  return useQuery<DigitalSignaturesResponse>({
    queryKey: ["/api/signatures", userId],
    enabled: !!userId,
  });
}

export function useCreateSignature(userId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (signatureData: any) => {
      console.log("useCreateSignature: userId =", userId);
      console.log("useCreateSignature: signatureData =", signatureData);
      
      if (!userId) {
        throw new Error("userId is required for signature creation");
      }

      const requestData = {
        userId,
        ...signatureData,
      };
      
      console.log("useCreateSignature: final request data =", requestData);
      console.log("useCreateSignature: request data keys =", Object.keys(requestData));

      const response = await apiRequest("POST", "/api/signatures", requestData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/signatures", userId] });
    },
  });
}

export function useDeleteSignature(userId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (signatureId: string) => {
      const response = await apiRequest("DELETE", `/api/signatures/${signatureId}`, {
        userId,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/signatures", userId] });
    },
  });
}

export function useSignatureCertificate(signatureId: string) {
  return useQuery<{ success: boolean; certificate: any }>({
    queryKey: ["/api/signatures", signatureId, "certificate"],
    enabled: !!signatureId,
  });
}
