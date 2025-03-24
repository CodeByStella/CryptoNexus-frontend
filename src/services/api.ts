import axios from "axios";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface AddressData {
    chain: string;
    address: string;
    _id: string;
  }
  
  export interface DepositAddress {
    _id: string;
    token: string;
    addresses: AddressData[];
    createdAt: string;
    updatedAt: string;
  }
  
const getAuthToken = () => {
  return localStorage.getItem("token");
};

export const fetchDepositAddresses = async (): Promise<DepositAddress[]> => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_BASE_URL}/api/deposit-addresses`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching deposit addresses:", error);
    throw error;
  }
};

export const updateDepositAddresses = async (
  updatedAddresses: DepositAddress[]
): Promise<void> => {
  try {
    const token = getAuthToken();
    await axios.put(
      `${API_BASE_URL}/api/update-addresses`,
      { addresses: updatedAddresses },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error("Error updating deposit addresses:", error);
    throw error;
  }
};
