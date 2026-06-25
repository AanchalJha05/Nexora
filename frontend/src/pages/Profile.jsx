import { useEffect, useState } from "react";
import api from "../api/api";

function Profile() {
    const [profile, setProfile] = useState({
        username: "",
        email: "",
        phone: "",
        address: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        api.get("profile/")
            .then((res) => {
                setProfile(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        setSaving(true);

        api.put("profile/update/", {
            phone: profile.phone,
            address: profile.address
        })
            .then((res) => {
                setProfile(res.data);
            })
            .catch(() => alert("Update failed"))
            .finally(() => setSaving(false));
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-gray-400 animate-pulse text-sm">
                    Loading account...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

            {/* MAIN CARD */}
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

                {/* HEADER */}
                <div className="mb-6">
                    <h1 className="text-lg font-medium text-gray-600">
                        Account Settings
                    </h1>
                    <p className="text-xs text-gray-400 mt-1">
                        Manage your personal information
                    </p>
                </div>

                {/* FIELDS */}
                <div className="space-y-4">

                    {/* Username */}
                    <div>
                        <label className="text-xs text-gray-400">Username</label>
                        <input
                            value={profile.username}
                            disabled
                            className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-50 border border-gray-100
                                       text-gray-500 text-sm"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="text-xs text-gray-400">Email</label>
                        <input
                            value={profile.email}
                            disabled
                            className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-50 border border-gray-100
                                       text-gray-500 text-sm"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="text-xs text-gray-400">Phone</label>
                        <input
                            name="phone"
                            value={profile.phone || ""}
                            onChange={handleChange}
                            className="w-full mt-1 px-3 py-2 rounded-xl bg-white border border-gray-200
                                       text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                        />
                    </div>

                    {/* Address */}
                    <div>
                        <label className="text-xs text-gray-400">Address</label>
                        <textarea
                            name="address"
                            value={profile.address || ""}
                            onChange={handleChange}
                            rows="3"
                            className="w-full mt-1 px-3 py-2 rounded-xl bg-white border border-gray-200
                                       text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 resize-none"
                        />
                    </div>

                </div>

                {/* ACTION */}
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full mt-6 py-2.5 rounded-xl text-white text-sm font-medium
                               bg-gray-900 hover:bg-black transition active:scale-95"
                >
                    {saving ? "Saving..." : "Save Changes"}
                </button>

            </div>
        </div>
    );
}

export default Profile;