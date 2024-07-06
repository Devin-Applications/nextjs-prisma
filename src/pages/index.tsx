import { NextPage } from "next";
import Head from "next/head";
import { useMemo, useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import { Vendor } from "../types";
import axios from "axios";

export const VendorList: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get("/api/vendors")
      .then(response => setVendors(response.data))
      .catch(err => setError(err.message));
  }, []);

  if (error != null) return <div>Error loading vendors...</div>;
  if (vendors == null) return <div>Loading...</div>;

  if (vendors.length === 0) {
    return <div className={styles.emptyState}>Try adding a vendor ☝️️</div>;
  }

  return (
    <ul className={styles.vendorList}>
      {vendors.map(vendor => (
        <VendorItem key={vendor.id} vendor={vendor} />
      ))}
    </ul>
  );
};

const VendorItem: React.FC<{ vendor: Vendor }> = ({ vendor }) => (
  <li className={styles.vendor}>
    <label className={styles.label}>
      {vendor.name}
    </label>
    <button className={styles.deleteButton} onClick={() => {
      axios.delete("/api/vendors", { data: { id: vendor.id } })
        .then(() => window.location.reload())
        .catch(err => console.error(err));
    }}>
      ✕
    </button>
  </li>
);

const AddVendorInput = () => {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [services, setServices] = useState("");

  return (
    <form
      onSubmit={async e => {
        e.preventDefault();
        axios.post("/api/vendors", { name, contact, services })
          .then(() => window.location.reload())
          .catch(err => console.error(err));
        setName("");
        setContact("");
        setServices("");
      }}
      className={styles.addVendor}
    >
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
      <button className={styles.addButton}>Add</button>
    </form>
  );
};

const Home: NextPage = () => {
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
        <AddVendorInput />
        <VendorList />
      </main>
    </div>
  );
};

export default Home;
