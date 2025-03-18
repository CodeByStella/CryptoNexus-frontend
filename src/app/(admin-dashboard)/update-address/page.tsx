"use client"
import { useEffect, useState } from "react";
import axios from "axios";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

const AdminUpdateAddresses = () => {
  const [addresses, setAddresses] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const { data } = await axios.get("/api/admin/deposit-addresses");
        setAddresses(data);
      } catch (error) {
        console.error("Failed to fetch addresses", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  const handleChange = (token: string, chain: string, value: string) => {
    setAddresses((prev) =>
      prev.map((item) =>
        item.token === token && item.chain === chain
          ? { ...item, address: value }
          : item
      )
    );
  };

  const handleSubmit = async () => {
    setUpdating(true);
    try {
      await axios.post("/api/admin/update-addresses", { addresses });
      alert("Deposit addresses updated successfully!");
    } catch (error) {
      console.error("Error updating addresses", error);
      alert("Failed to update addresses");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Update Deposit Addresses</h2>
      <div className="space-y-4">
        {addresses.map(({ token, chain, address }, index) => (
          <div key={index} className="flex items-center gap-4">
            <span className="w-24 font-semibold">{token}</span>
            <span className="w-24 text-gray-600">({chain})</span>
            <input
              value={address}
              onChange={(e) => handleChange(token, chain, e.target.value)}
              className="flex-1"
            />
          </div>
        ))}
      </div>
      <button onClick={handleSubmit} disabled={updating} className="mt-4">
        {updating ? "Updating..." : "Update Addresses"}
      </button>
    </div>
  );
};

export default AdminUpdateAddresses;
