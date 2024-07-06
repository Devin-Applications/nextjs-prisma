import { NextPage } from "next";
import Head from "next/head";
import { useMemo, useState } from "react";
import { createVendor, deleteVendor, toggleVendor, useVendors } from "../api";
import styles from "../styles/Home.module.css";
import { Vendor } from "../types";

export const VendorList: React.FC = () => {
  const { data: vendors, error } = useVendors();

  if (error != null) return <div>Error loading vendors...</div>;
  if (vendors == null) return <div>Loading...</div>;

  if (vendors.length === 0) {
    return <div className={styles.emptyState}>Try adding a vendor ☝️️</div>;
  }

  return (
    <ul className={styles.vendorList}>
      {vendors.map(vendor => (
        <VendorItem vendor={vendor} />
      ))}
    </ul>
  );
};

const VendorItem: React.FC<{ vendor: Vendor }> = ({ vendor }) => (
  <li className={styles.vendor}>
    <label
      className={`${styles.label} ${vendor.completed ? styles.checked : ""}`}
    >
      <input
        type="checkbox"
        checked={vendor.completed}
        className={`${styles.checkbox}`}
        onChange={() => toggleVendor(vendor)}
      />
      {vendor.name}
    </label>

    <button className={styles.deleteButton} onClick={() => deleteVendor(vendor.id)}>
      ✕
    </button>
  </li>
);

const AddVendorInput = () => {
  const [name, setName] = useState("");

  return (
    <form
      onSubmit={async e => {
        e.preventDefault();
        createVendor(name);
        setName("");
      }}
      className={styles.addVendor}
    >
      <input
        className={styles.input}
        placeholder="Vendor name"
        value={name}
        onChange={e => setName(e.target.value)}
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
