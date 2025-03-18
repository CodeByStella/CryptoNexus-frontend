// src/lib/api/deposit-addresses.ts
import axios from "axios";

interface AddressData {
  chain: string;
  address: string;
  _id?: string;
}

interface DepositAddress {
  _id: string;
  token: string;
  addresses: AddressData[];
  createdAt: string;
  updatedAt: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export const fetchAddresses = async () => {
  const response = await axios.get(`${BASE_URL}/api/admin/deposit-addresses`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

export const updateAddress = async (depositAddressId: string, data: { addresses: AddressData[] }) => {
  const response = await axios.put(`${BASE_URL}/api/admin/deposit-addresses/${depositAddressId}`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

export const addToken = async (data: { token: string; addresses: AddressData[] }) => {
  const response = await axios.post(`${BASE_URL}/api/admin/deposit-addresses`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};