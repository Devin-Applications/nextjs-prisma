import { NextPage } from "next";
import Head from "next/head";
import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import { Vendor } from "../types";
import axios from "axios";

const Home: NextPage = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    axios.get("/api/vendors")
      .then(response => setVendors(response.data))
      .catch(err => setError(err.message));
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Vendor Management System</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <h1 className={styles.title}>Vendors</h1>
        <h2 className={styles.desc}>
          NextJS app connected to Postgres using Prisma and hosted on{" "}
          <a href="https://railway.app">Railway</a>
        </h2>
      </header>

      <main className={styles.main}>
        <AddVendorInput setVendors={setVendors} loading={loading} setLoading={setLoading} />
        <VendorList vendors={vendors} setVendors={setVendors} error={error} loading={loading} setLoading={setLoading} />
      </main>
    </div>
  );
};

const VendorList: React.FC<{ vendors: Vendor[], setVendors: React.Dispatch<React.SetStateAction<Vendor[]>>, error: string | null, loading: boolean, setLoading: React.Dispatch<React.SetStateAction<boolean>> }> = ({ vendors, setVendors, error, loading, setLoading }) => {
  if (error != null) return <div>Error loading vendors: {error}</div>;
  if (vendors == null) return <div>Loading...</div>;

  if (vendors.length === 0) {
    return <div className={styles.emptyState}>Try adding a vendor ☝️️</div>;
  }

  return (
    <ul className={styles.vendorList}>
      {vendors.map(vendor => (
        <VendorItem key={vendor.id} vendor={vendor} setVendors={setVendors} loading={loading} setLoading={setLoading} />
      ))}
    </ul>
  );
};

const VendorItem: React.FC<{ vendor: Vendor, setVendors: React.Dispatch<React.SetStateAction<Vendor[]>>, loading: boolean, setLoading: React.Dispatch<React.SetStateAction<boolean>> }> = ({ vendor, setVendors, loading, setLoading }) => {
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      await axios.delete("/api/vendors", { data: { id: vendor.id } });
      setVendors(prevVendors => prevVendors.filter(v => v.id !== vendor.id));
      setError(null);
    } catch (err) {
      setError("Failed to delete vendor. Please try again.");
      console.error(err);
    }
  };

  return (
    <li className={styles.vendor}>
      <label className={styles.label}>
        {vendor.name} - {vendor.contact} - {vendor.services}
      </label>
      <button className={styles.deleteButton} onClick={handleDelete} disabled={loading}>
        ✕
      </button>
      {error && <div className={styles.error}>{error}</div>}
    </li>
  );
};

const AddVendorInput: React.FC<{ setVendors: React.Dispatch<React.SetStateAction<Vendor[]>>, loading: boolean, setLoading: React.Dispatch<React.SetStateAction<boolean>> }> = ({ setVendors, loading, setLoading }) => {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [services, setServices] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contact || !services) {
      setError("All fields are required.");
      return;
    }
    setLoading(true);
    try {
      console.log("Submitting vendor:", { name, contact, services });
      const response = await axios.post("/api/vendors", { name, contact, services });
      console.log("Vendor added:", response.data);
      setVendors(prevVendors => [...prevVendors, response.data]);
      setName("");
      setContact("");
      setServices("");
      setError(null);
    } catch (err) {
      setError("Failed to add vendor. Please try again.");
      console.error("Error adding vendor:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.addVendor}>
      <input
        className={styles.input}
        placeholder="Vendor name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        className={styles.input}
        placeholder="Contact"
        value={contact}
        onChange={e => setContact(e.target.value)}
      />
      <input
        className={styles.input}
        placeholder="Services"
        value={services}
        onChange={e => setServices(e.target.value)}
      />
      <button className={styles.addButton} disabled={loading}>Add</button>
      {error && <div className={styles.error}>{error}</div>}
    </form>
  );
};

export default Home;
