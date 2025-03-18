// src/app/(admin-dashboard)/admin-addresses/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { fetchAddresses, updateAddress, addToken } from "@/lib/deposit-address";

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

const AdminDepositAddresses = () => {
  const [addresses, setAddresses] = useState<DepositAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [editingTokenId, setEditingTokenId] = useState<string | null>(null);
  const [showAddTokenForm, setShowAddTokenForm] = useState(false);
  const [newTokenData, setNewTokenData] = useState<{ token: string; addresses: AddressData[] }>({
    token: "",
    addresses: [{ chain: "", address: "" }],
  });

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        setLoading(true);
        const data = await fetchAddresses();
        setAddresses(data);
      } catch (err) {
        setError("Failed to load deposit addresses");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadAddresses();
  }, []);

  const handleSaveChanges = async (depositAddress: DepositAddress) => {
    try {
      setLoading(true);
      await updateAddress(depositAddress._id, { addresses: depositAddress.addresses });
      const updatedAddresses = await fetchAddresses();
      setAddresses(updatedAddresses);
      setEditingTokenId(null);
    } catch (err) {
      setError("Failed to update addresses");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddChainAddress = (tokenId: string) => {
    setAddresses(addresses.map(addr => {
      if (addr._id === tokenId) {
        return {
          ...addr,
          addresses: [...addr.addresses, { chain: "", address: "" }]
        };
      }
      return addr;
    }));
  };

  const handleRemoveChainAddress = (tokenId: string, addressIndex: number) => {
    setAddresses(addresses.map(addr => {
      if (addr._id === tokenId) {
        const updatedAddresses = [...addr.addresses];
        updatedAddresses.splice(addressIndex, 1);
        return {
          ...addr,
          addresses: updatedAddresses
        };
      }
      return addr;
    }));
  };

  const handleAddressChange = (
    tokenId: string, 
    addressIndex: number, 
    field: 'chain' | 'address', 
    value: string
  ) => {
    setAddresses(addresses.map(addr => {
      if (addr._id === tokenId) {
        const updatedAddresses = [...addr.addresses];
        updatedAddresses[addressIndex] = {
          ...updatedAddresses[addressIndex],
          [field]: value
        };
        return {
          ...addr,
          addresses: updatedAddresses
        };
      }
      return addr;
    }));
  };

  const handleAddToken = async () => {
    try {
      setLoading(true);
      if (!newTokenData.token || newTokenData.addresses.some(a => !a.chain || !a.address)) {
        return;
      }
      await addToken(newTokenData);
      const updatedAddresses = await fetchAddresses();
      setAddresses(updatedAddresses);
      setNewTokenData({
        token: "",
        addresses: [{ chain: "", address: "" }]
      });
      setShowAddTokenForm(false);
    } catch (err) {
      setError("Failed to add token");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewChainAddress = () => {
    setNewTokenData({
      ...newTokenData,
      addresses: [...newTokenData.addresses, { chain: "", address: "" }]
    });
  };

  const handleRemoveNewChainAddress = (index: number) => {
    const updatedAddresses = [...newTokenData.addresses];
    updatedAddresses.splice(index, 1);
    setNewTokenData({
      ...newTokenData,
      addresses: updatedAddresses
    });
  };

  const handleNewTokenChange = (
    index: number, 
    field: 'chain' | 'address', 
    value: string
  ) => {
    const updatedAddresses = [...newTokenData.addresses];
    updatedAddresses[index] = {
      ...updatedAddresses[index],
      [field]: value
    };
    setNewTokenData({
      ...newTokenData,
      addresses: updatedAddresses
    });
  };

  if (loading && addresses.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error && addresses.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Deposit Address Management</h1>
          <p className="text-gray-600">Manage cryptocurrency deposit addresses for your platform</p>
        </header>

        <div className="mb-8">
          <button 
            onClick={() => setShowAddTokenForm(!showAddTokenForm)}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
          >
            {showAddTokenForm ? 'Cancel' : 'Add New Token'}
          </button>
        </div>

        {showAddTokenForm && (
          <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Add New Token</h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Token Symbol</label>
              <input
                type="text"
                value={newTokenData.token}
                onChange={(e) => setNewTokenData({...newTokenData, token: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="BTC"
              />
            </div>

            {newTokenData.addresses.map((address, index) => (
              <div key={index} className="mb-4 p-4 border rounded-md">
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium">Chain-Address Pair #{index + 1}</h3>
                  {newTokenData.addresses.length > 1 && (
                    <button
                      onClick={() => handleRemoveNewChainAddress(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-1">Chain</label>
                    <input
                      type="text"
                      value={address.chain}
                      onChange={(e) => handleNewTokenChange(index, 'chain', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="TRC20"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={address.address}
                      onChange={(e) => handleNewTokenChange(index, 'address', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="0x..."
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-between mt-4">
              <button
                onClick={handleAddNewChainAddress}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                Add Chain-Address Pair
              </button>
              <button
                onClick={handleAddToken}
                disabled={loading}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition disabled:bg-gray-400"
              >
                {loading ? 'Saving...' : 'Save Token'}
              </button>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {addresses.map((depositAddress) => (
            <div 
              key={depositAddress._id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="px-6 py-4 bg-gray-50 border-b flex justify-between items-center">
                <h2 className="text-xl font-semibold">{depositAddress.token}</h2>
                <div>
                  {editingTokenId === depositAddress._id ? (
                    <div className="space-x-2">
                      <button
                        onClick={() => setEditingTokenId(null)}
                        className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveChanges(depositAddress)}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditingTokenId(depositAddress._id)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-500">
                    Last updated: {new Date(depositAddress.updatedAt).toLocaleString()}
                  </p>
                </div>
                
                {depositAddress.addresses.map((address, index) => (
                  <div 
                    key={address._id || index} 
                    className="mb-4 p-4 border rounded-md"
                  >
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medium">Chain-Address Pair #{index + 1}</h3>
                      {editingTokenId === depositAddress._id && depositAddress.addresses.length > 1 && (
                        <button
                          onClick={() => handleRemoveChainAddress(depositAddress._id, index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 mb-1">Chain</label>
                        {editingTokenId === depositAddress._id ? (
                          <input
                            type="text"
                            value={address.chain}
                            onChange={(e) => 
                              handleAddressChange(depositAddress._id, index, 'chain', e.target.value)
                            }
                            className="w-full px-3 py-2 border rounded-md"
                          />
                        ) : (
                          <p className="py-2">{address.chain}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-1">Address</label>
                        {editingTokenId === depositAddress._id ? (
                          <input
                            type="text"
                            value={address.address}
                            onChange={(e) => 
                              handleAddressChange(depositAddress._id, index, 'address', e.target.value)
                            }
                            className="w-full px-3 py-2 border rounded-md"
                          />
                        ) : (
                          <p className="py-2 break-all">{address.address}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {editingTokenId === depositAddress._id && (
                  <button
                    onClick={() => handleAddChainAddress(depositAddress._id)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition mt-4"
                  >
                    Add Chain-Address Pair
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDepositAddresses;