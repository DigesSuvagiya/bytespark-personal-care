import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiPlus, FiX } from "react-icons/fi";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import AccessibleModal from "../components/AccessibleModal";
import "./admin-dashboard.css";

const SIDEBAR_TABS = ["Orders", "Add Product", "Profile"];
const ORDER_STATUS_OPTIONS = ["placed", "processing", "shipped", "delivered", "cancelled"];
const PROFILE_STORAGE_KEY = "bytesparkAdminProfileDemo";

const DEFAULT_PROFILE = {
  displayName: "ByteSpark Admin",
  email: "admin@bytespark.demo",
  phone: "+91 98765 43210",
  department: "Operations",
  timezone: "Asia/Kolkata",
  bio: "Responsible for catalog updates, order monitoring, and fulfillment coordination.",
  alertsByEmail: true,
  alertsBySms: false,
};

const formatCurrency = (value) => `Rs.${Number(value || 0).toLocaleString("en-IN")}`;

const formatDateTime = (value) => {
  if (!value) return "--";
  return new Date(value).toLocaleString();
};

const getInitialProfile = () => {
  if (typeof window === "undefined") {
    return { ...DEFAULT_PROFILE };
  }

  try {
    const stored = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!stored) return { ...DEFAULT_PROFILE };

    const parsed = JSON.parse(stored);
    return { ...DEFAULT_PROFILE, ...parsed };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
};

export default function AdminDashboard() {
  const [status, setStatus] = useState("Verifying admin session...");
  const [activeTab, setActiveTab] = useState("Orders");
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");
  const [statusDraft, setStatusDraft] = useState("placed");
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusUpdateMessage, setStatusUpdateMessage] = useState("");
  const [statusUpdateError, setStatusUpdateError] = useState("");
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState("");
  const [productsNotice, setProductsNotice] = useState("");
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [addProductInfo, setAddProductInfo] = useState("");
  const [addProductError, setAddProductError] = useState("");
  const [addProductSubmitting, setAddProductSubmitting] = useState(false);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [editProductSubmitting, setEditProductSubmitting] = useState(false);
  const [editProductError, setEditProductError] = useState("");
  const [editingProductId, setEditingProductId] = useState("");
  const [addProductForm, setAddProductForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });
  const [editProductForm, setEditProductForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });
  const [savedProfile, setSavedProfile] = useState(getInitialProfile);
  const [profileForm, setProfileForm] = useState(getInitialProfile);
  const [profileNotice, setProfileNotice] = useState("");
  const [profileNoticeType, setProfileNoticeType] = useState("info");
  const [profileDirty, setProfileDirty] = useState(false);

  const navigate = useNavigate();
  const { logout } = useAuth();

  const pendingOrders = useMemo(
    () => orders.filter((order) => (order.status || "").toLowerCase() !== "delivered").length,
    [orders]
  );

  const totalRevenue = useMemo(
    () => orders.reduce((sum, order) => sum + Number(order.totalPrice || 0), 0),
    [orders]
  );

  const profileCompletion = useMemo(() => {
    const requiredFields = [
      profileForm.displayName,
      profileForm.email,
      profileForm.phone,
      profileForm.department,
      profileForm.timezone,
      profileForm.bio,
    ];
    const completed = requiredFields.filter((field) => String(field || "").trim()).length;
    return Math.round((completed / requiredFields.length) * 100);
  }, [profileForm]);

  useEffect(() => {
    let mounted = true;

    const verifyAdmin = async () => {
      try {
        await api.get("/auth/admin/verify");
        if (mounted) setStatus("Admin access confirmed");
      } catch {
        logout();
        if (mounted) setStatus("Admin session expired or invalid");
        navigate("/", { replace: true });
      }
    };

    verifyAdmin();

    return () => {
      mounted = false;
    };
  }, [logout, navigate]);

  useEffect(() => {
    if (activeTab !== "Orders") return;

    let mounted = true;

    const fetchOrders = async () => {
      setOrdersLoading(true);
      setOrdersError("");

      try {
        const res = await api.get("/orders/admin/all");
        if (mounted) {
          setOrders(Array.isArray(res.data) ? res.data : []);
        }
      } catch (error) {
        if (mounted) {
          setOrdersError(error.response?.data?.message || "Failed to load orders");
          setOrders([]);
        }
      } finally {
        if (mounted) setOrdersLoading(false);
      }
    };

    fetchOrders();

    return () => {
      mounted = false;
    };
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== "Add Product") return;

    let mounted = true;

    const fetchProducts = async () => {
      setProductsLoading(true);
      setProductsError("");

      try {
        const res = await api.get("/products");
        if (mounted) {
          setProducts(Array.isArray(res.data) ? res.data : []);
        }
      } catch (error) {
        if (mounted) {
          setProductsError(error.response?.data?.message || "Failed to load products");
          setProducts([]);
        }
      } finally {
        if (mounted) setProductsLoading(false);
      }
    };

    fetchProducts();

    return () => {
      mounted = false;
    };
  }, [activeTab]);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setDetailsError("");
    setDetailsLoading(false);
    setStatusDraft("placed");
    setStatusUpdating(false);
    setStatusUpdateMessage("");
    setStatusUpdateError("");
  };

  const closeAddProductModal = () => {
    setIsAddProductModalOpen(false);
    setAddProductInfo("");
    setAddProductError("");
    setAddProductSubmitting(false);
  };

  const closeEditProductModal = () => {
    setIsEditProductModalOpen(false);
    setEditProductSubmitting(false);
    setEditProductError("");
    setEditingProductId("");
    setEditProductForm({
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
    });
  };

  const openAddProductModal = () => {
    setAddProductForm({
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
    });
    setAddProductInfo("");
    setAddProductError("");
    setIsAddProductModalOpen(true);
  };

  const handleAddProductFieldChange = (event) => {
    const { name, value } = event.target;
    setAddProductForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditProductFieldChange = (event) => {
    const { name, value } = event.target;
    setEditProductForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProductSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      name: addProductForm.name.trim(),
      description: addProductForm.description.trim(),
      price: Number(addProductForm.price),
      category: addProductForm.category.trim(),
      image: addProductForm.image.trim(),
    };

    if (!payload.name || !payload.category || !payload.image) {
      setAddProductError("Name, category, and image filename are required.");
      setAddProductInfo("");
      return;
    }

    if (!Number.isFinite(payload.price) || payload.price <= 0) {
      setAddProductError("Price must be greater than 0.");
      setAddProductInfo("");
      return;
    }

    setAddProductSubmitting(true);
    setAddProductError("");
    setAddProductInfo("");

    try {
      const res = await api.post("/products/admin", payload);
      const createdProduct = res.data;

      setProducts((prevProducts) => [createdProduct, ...prevProducts]);
      setProductsNotice("Product added successfully.");

      setAddProductForm({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
      });
      setIsAddProductModalOpen(false);
    } catch (error) {
      setAddProductError(error.response?.data?.message || "Failed to create product");
    } finally {
      setAddProductSubmitting(false);
    }
  };

  const handleViewOrder = async (orderId) => {
    setDetailsLoading(true);
    setDetailsError("");
    setSelectedOrder(null);
    setStatusUpdateMessage("");
    setStatusUpdateError("");

    try {
      const res = await api.get(`/orders/admin/${orderId}`);
      const orderData = res.data;
      setSelectedOrder(orderData);
      setStatusDraft(orderData?.status || "placed");
    } catch (error) {
      setDetailsError(error.response?.data?.message || "Failed to fetch order details");
    } finally {
      setDetailsLoading(false);
    }
  };

  const openEditProductModal = (product) => {
    setEditingProductId(product?._id || "");
    setEditProductForm({
      name: product?.name || "",
      description: product?.description || "",
      price: String(product?.price ?? ""),
      category: product?.category || "",
      image: product?.image || "",
    });
    setEditProductError("");
    setIsEditProductModalOpen(true);
  };

  const handleEditProductSubmit = async (event) => {
    event.preventDefault();

    if (!editingProductId) {
      setEditProductError("No product selected for edit.");
      return;
    }

    const payload = {
      name: editProductForm.name.trim(),
      description: editProductForm.description.trim(),
      price: Number(editProductForm.price),
      category: editProductForm.category.trim(),
    };

    if (!payload.name || !payload.category) {
      setEditProductError("Name and category are required.");
      return;
    }

    if (!Number.isFinite(payload.price) || payload.price <= 0) {
      setEditProductError("Price must be greater than 0.");
      return;
    }

    setEditProductSubmitting(true);
    setEditProductError("");

    try {
      const res = await api.put(`/products/admin/${editingProductId}`, payload);
      const updatedProduct = res.data;

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === updatedProduct._id ? { ...product, ...updatedProduct } : product
        )
      );
      setProductsNotice("Product updated successfully.");
      closeEditProductModal();
    } catch (error) {
      setEditProductError(error.response?.data?.message || "Failed to update product");
    } finally {
      setEditProductSubmitting(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedOrder?._id) return;

    setStatusUpdating(true);
    setStatusUpdateMessage("");
    setStatusUpdateError("");

    try {
      const res = await api.patch(`/orders/admin/${selectedOrder._id}/status`, {
        status: statusDraft,
      });

      const updatedOrder = res.data;
      setSelectedOrder(updatedOrder);
      setStatusDraft(updatedOrder?.status || "placed");
      setStatusUpdateMessage("Order status updated.");

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder._id ? { ...order, ...updatedOrder } : order
        )
      );
    } catch (error) {
      setStatusUpdateError(error.response?.data?.message || "Failed to update status");
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleProfileFieldChange = (event) => {
    const { name, value, type, checked } = event.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setProfileDirty(true);
    setProfileNotice("");
  };

  const handleProfileSubmit = (event) => {
    event.preventDefault();

    const normalizedProfile = {
      ...profileForm,
      displayName: profileForm.displayName.trim(),
      email: profileForm.email.trim().toLowerCase(),
      phone: profileForm.phone.trim(),
      department: profileForm.department.trim(),
      timezone: profileForm.timezone.trim(),
      bio: profileForm.bio.trim(),
    };

    if (!normalizedProfile.displayName || !normalizedProfile.email) {
      setProfileNoticeType("error");
      setProfileNotice("Display name and email are required.");
      return;
    }

    setProfileForm(normalizedProfile);
    setSavedProfile(normalizedProfile);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(normalizedProfile));
    }

    setProfileDirty(false);
    setProfileNoticeType("success");
    setProfileNotice(`Demo profile saved locally at ${new Date().toLocaleTimeString()}.`);
  };

  const handleProfileReset = () => {
    setProfileForm(savedProfile);
    setProfileDirty(false);
    setProfileNoticeType("info");
    setProfileNotice("Unsaved changes were discarded.");
  };

  const handleProfileDefaults = () => {
    setProfileForm({ ...DEFAULT_PROFILE });
    setProfileDirty(true);
    setProfileNoticeType("info");
    setProfileNotice("Default demo data loaded. Click Save Profile to persist.");
  };

  return (
    <main className="admin-page">
      <div className="admin-shell">
        <header className="admin-topbar">
          <div className="admin-topbar-brand">
            <p className="admin-topbar-kicker">ByteSpark Admin</p>
            <h1>Dashboard</h1>
          </div>
          <div className="admin-topbar-actions">
            <button className="admin-btn admin-btn-store" onClick={() => navigate("/")}>
              Go to Store
            </button>
            <button className="admin-btn admin-btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <div className="admin-layout">
          <aside className="admin-sidebar">
            <nav className="admin-nav">
              {SIDEBAR_TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`admin-nav-tab ${activeTab === tab ? "active" : ""}`}
                  aria-current={activeTab === tab ? "page" : undefined}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </aside>

          <section className="admin-content">
            <div className="admin-content-head">
              <h2>{activeTab}</h2>
              <p className="admin-status">{status}</p>
            </div>

            {activeTab === "Orders" ? (
              <>
                <div className="admin-cards">
                  <article className="admin-card">
                    <p className="admin-card-label">Total Orders</p>
                    <p className="admin-card-value">{orders.length}</p>
                  </article>
                  <article className="admin-card">
                    <p className="admin-card-label">Pending Orders</p>
                    <p className="admin-card-value">{pendingOrders}</p>
                  </article>
                  <article className="admin-card">
                    <p className="admin-card-label">Revenue</p>
                    <p className="admin-card-value">{formatCurrency(totalRevenue)}</p>
                  </article>
                </div>

                <div className="admin-orders-wrap">
                  {ordersLoading && <p className="admin-orders-message">Loading orders...</p>}
                  {!ordersLoading && ordersError && (
                    <p className="admin-orders-message admin-orders-error">{ordersError}</p>
                  )}
                  {!ordersLoading && !ordersError && orders.length === 0 && (
                    <p className="admin-orders-message">No orders found.</p>
                  )}

                  {!ordersLoading && !ordersError && orders.length > 0 && (
                    <div className="admin-orders-table-scroll">
                      <table className="admin-orders-table">
                        <thead>
                          <tr>
                            <th>Order ID</th>
                            <th>Username</th>
                            <th>Total Price</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order) => {
                            const username =
                              order.user?.name || order.shipping?.fullName || "Unknown";

                            return (
                              <tr key={order._id}>
                                <td data-label="Order ID" className="admin-mono">{order._id}</td>
                                <td data-label="Username">{username}</td>
                                <td data-label="Total Price">{formatCurrency(order.totalPrice)}</td>
                                <td data-label="Status">
                                  <span
                                    className={`admin-status-pill status-${(order.status || "placed").toLowerCase()}`}
                                  >
                                    {order.status || "placed"}
                                  </span>
                                </td>
                                <td data-label="Date">{formatDateTime(order.createdAt)}</td>
                                <td data-label="Action" className="admin-cell-action">
                                  <button
                                    type="button"
                                    className="admin-view-btn"
                                    onClick={() => handleViewOrder(order._id)}
                                  >
                                    <FiEye size={16} />
                                    View
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            ) : activeTab === "Add Product" ? (
              <div className="admin-products-wrap">
                <div className="admin-products-head">
                  <div className="admin-products-title">
                    <h3>Current Products</h3>
                    <p className="admin-products-note">
                      Note: Images currently use local <strong>public/products</strong> files and may
                      not work as expected on Vercel deployments.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="admin-btn admin-add-product-btn"
                    onClick={openAddProductModal}
                  >
                    <FiPlus size={16} />
                    Add New Product
                  </button>
                </div>
                {productsNotice && <p className="admin-products-notice">{productsNotice}</p>}

                {productsLoading && <p className="admin-orders-message">Loading products...</p>}
                {!productsLoading && productsError && (
                  <p className="admin-orders-message admin-orders-error">{productsError}</p>
                )}
                {!productsLoading && !productsError && products.length === 0 && (
                  <p className="admin-orders-message">No products found.</p>
                )}

                {!productsLoading && !productsError && products.length > 0 && (
                  <div className="admin-products-table-scroll">
                    <table className="admin-products-table">
                      <thead>
                        <tr>
                          <th>Image</th>
                          <th>Name</th>
                          <th>Category</th>
                          <th>Price</th>
                          <th>Description</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr key={product._id}>
                            <td data-label="Image">
                              <div className="admin-product-thumb">
                                {product.image ? (
                                  <img
                                    src={`/products/${product.image}`}
                                    alt={product.name || "Product"}
                                    onError={(event) => {
                                      event.currentTarget.style.display = "none";
                                    }}
                                  />
                                ) : (
                                  <span className="admin-product-fallback">No image</span>
                                )}
                              </div>
                            </td>
                            <td data-label="Name">{product.name || "--"}</td>
                            <td data-label="Category">{product.category || "--"}</td>
                            <td data-label="Price">{formatCurrency(product.price)}</td>
                            <td data-label="Description" className="admin-product-desc">
                              {product.description || "--"}
                            </td>
                            <td data-label="Action" className="admin-cell-action">
                              <button
                                type="button"
                                className="admin-view-btn"
                                onClick={() => openEditProductModal(product)}
                              >
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : activeTab === "Profile" ? (
              <div className="admin-profile-wrap">
                <div className="admin-profile-head">
                  <div>
                    <h3>Admin Profile (Demo)</h3>
                    <p>
                      This module is frontend-only for demo purposes. Changes are saved in your browser
                      storage, not in backend/database.
                    </p>
                  </div>
                  <span className="admin-profile-chip">{profileCompletion}% complete</span>
                </div>

                <div className="admin-profile-layout">
                  <form className="admin-profile-form" onSubmit={handleProfileSubmit}>
                    <div className="admin-profile-grid">
                      <label>
                        Display Name
                        <input
                          type="text"
                          name="displayName"
                          value={profileForm.displayName}
                          onChange={handleProfileFieldChange}
                          required
                        />
                      </label>

                      <label>
                        Email
                        <input
                          type="email"
                          name="email"
                          value={profileForm.email}
                          onChange={handleProfileFieldChange}
                          required
                        />
                      </label>

                      <label>
                        Phone
                        <input
                          type="text"
                          name="phone"
                          value={profileForm.phone}
                          onChange={handleProfileFieldChange}
                        />
                      </label>

                      <label>
                        Department
                        <input
                          type="text"
                          name="department"
                          value={profileForm.department}
                          onChange={handleProfileFieldChange}
                        />
                      </label>

                      <label>
                        Timezone
                        <input
                          type="text"
                          name="timezone"
                          value={profileForm.timezone}
                          onChange={handleProfileFieldChange}
                        />
                      </label>

                      <label>
                        Role
                        <input type="text" value="Administrator" disabled />
                      </label>
                    </div>

                    <label className="admin-profile-bio-label">
                      Bio
                      <textarea
                        name="bio"
                        value={profileForm.bio}
                        onChange={handleProfileFieldChange}
                        rows="4"
                      />
                    </label>

                    <div className="admin-profile-toggles">
                      <label className="admin-profile-toggle">
                        <input
                          type="checkbox"
                          name="alertsByEmail"
                          checked={profileForm.alertsByEmail}
                          onChange={handleProfileFieldChange}
                        />
                        Email alerts for new orders
                      </label>

                      <label className="admin-profile-toggle">
                        <input
                          type="checkbox"
                          name="alertsBySms"
                          checked={profileForm.alertsBySms}
                          onChange={handleProfileFieldChange}
                        />
                        SMS alerts for high-priority issues
                      </label>
                    </div>

                    {profileNotice && (
                      <p className={`admin-profile-notice admin-profile-notice-${profileNoticeType}`}>
                        {profileNotice}
                      </p>
                    )}

                    <div className="admin-profile-actions">
                      <button type="button" className="admin-view-btn" onClick={handleProfileDefaults}>
                        Load Defaults
                      </button>
                      <button
                        type="button"
                        className="admin-view-btn"
                        onClick={handleProfileReset}
                        disabled={!profileDirty}
                      >
                        Reset Changes
                      </button>
                      <button type="submit" className="admin-btn" disabled={!profileDirty}>
                        Save Profile
                      </button>
                    </div>
                  </form>

                  <aside className="admin-profile-side">
                    <article className="admin-profile-card">
                      <p className="admin-card-label">Quick Snapshot</p>
                      <ul className="admin-profile-list">
                        <li>
                          <span>Managed Orders</span>
                          <strong>{orders.length}</strong>
                        </li>
                        <li>
                          <span>Pending Queue</span>
                          <strong>{pendingOrders}</strong>
                        </li>
                        <li>
                          <span>Product Catalog</span>
                          <strong>{products.length}</strong>
                        </li>
                      </ul>
                    </article>

                    <article className="admin-profile-card">
                      <p className="admin-card-label">Current Preferences</p>
                      <ul className="admin-profile-list">
                        <li>
                          <span>Email Alerts</span>
                          <strong>{profileForm.alertsByEmail ? "Enabled" : "Disabled"}</strong>
                        </li>
                        <li>
                          <span>SMS Alerts</span>
                          <strong>{profileForm.alertsBySms ? "Enabled" : "Disabled"}</strong>
                        </li>
                        <li>
                          <span>Timezone</span>
                          <strong>{profileForm.timezone || "--"}</strong>
                        </li>
                      </ul>
                    </article>
                  </aside>
                </div>
              </div>
            ) : (
              <article className="admin-placeholder">
                <h3>{activeTab} Module</h3>
                <p>This tab UI is ready. Feature implementation is pending.</p>
              </article>
            )}
          </section>
        </div>
      </div>

      <AccessibleModal
        isOpen={Boolean(detailsLoading || selectedOrder || detailsError)}
        onClose={closeModal}
        className="admin-modal"
        overlayClassName="admin-modal-overlay"
        ariaLabelledBy="admin-order-details-title"
      >
            <button type="button" className="admin-modal-close" onClick={closeModal} aria-label="Close details">
              <FiX size={20} />
            </button>

            <h3 id="admin-order-details-title">Order Details</h3>

            {detailsLoading && <p className="admin-orders-message">Loading details...</p>}
            {!detailsLoading && detailsError && (
              <p className="admin-orders-message admin-orders-error">{detailsError}</p>
            )}

            {!detailsLoading && !detailsError && selectedOrder && (
              <div className="admin-order-detail">
                <div className="admin-detail-grid">
                  <p><strong>Order ID:</strong> <span className="admin-mono">{selectedOrder._id}</span></p>
                  <p><strong>Status:</strong> {selectedOrder.status || "placed"}</p>
                  <p><strong>Total:</strong> {formatCurrency(selectedOrder.totalPrice)}</p>
                  <p><strong>Payment:</strong> {selectedOrder.paymentMethod || "cod"}</p>
                  <p><strong>Customer:</strong> {selectedOrder.user?.name || selectedOrder.shipping?.fullName || "Unknown"}</p>
                  <p><strong>Mobile:</strong> {selectedOrder.user?.number || selectedOrder.shipping?.phone || "--"}</p>
                  <p><strong>Email:</strong> {selectedOrder.shipping?.email || "--"}</p>
                  <p><strong>Date:</strong> {formatDateTime(selectedOrder.createdAt)}</p>
                </div>

                <div className="admin-detail-block">
                  <h4>Update Status</h4>
                  <div className="admin-status-update">
                    <select
                      className="admin-status-select"
                      value={statusDraft}
                      onChange={(event) => setStatusDraft(event.target.value)}
                      disabled={statusUpdating}
                    >
                      {ORDER_STATUS_OPTIONS.map((statusValue) => (
                        <option key={statusValue} value={statusValue}>
                          {statusValue}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      className="admin-btn admin-update-btn"
                      onClick={handleStatusUpdate}
                      disabled={statusUpdating}
                    >
                      {statusUpdating ? "Updating..." : "Update Status"}
                    </button>
                  </div>
                  {statusUpdateMessage && (
                    <p className="admin-update-message admin-update-success">{statusUpdateMessage}</p>
                  )}
                  {statusUpdateError && (
                    <p className="admin-update-message admin-update-error">{statusUpdateError}</p>
                  )}
                </div>

                <div className="admin-detail-block">
                  <h4>Shipping Address</h4>
                  <p>
                    {selectedOrder.shipping?.address || "--"},{" "}
                    {selectedOrder.shipping?.city || "--"}, {selectedOrder.shipping?.state || "--"}{" "}
                    {selectedOrder.shipping?.zip || "--"}
                  </p>
                </div>

                <div className="admin-detail-block">
                  <h4>Items</h4>
                  <div className="admin-items-scroll">
                    <table className="admin-items-table">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Qty</th>
                          <th>Price</th>
                          <th>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(selectedOrder.items || []).map((item, index) => (
                          <tr key={`${item.product || item.name || "item"}-${index}`}>
                            <td data-label="Product">{item.name || "--"}</td>
                            <td data-label="Qty">{item.quantity || 0}</td>
                            <td data-label="Price">{formatCurrency(item.price)}</td>
                            <td data-label="Subtotal">
                              {formatCurrency(Number(item.price || 0) * Number(item.quantity || 0))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
      </AccessibleModal>

      <AccessibleModal
        isOpen={isAddProductModalOpen}
        onClose={closeAddProductModal}
        className="admin-modal admin-add-modal"
        overlayClassName="admin-modal-overlay"
        ariaLabelledBy="admin-add-product-title"
      >
            <button
              type="button"
              className="admin-modal-close"
              onClick={closeAddProductModal}
              aria-label="Close add product"
            >
              <FiX size={20} />
            </button>

            <h3 id="admin-add-product-title">Add New Product</h3>

            <form className="admin-add-form" onSubmit={handleAddProductSubmit}>
              <div className="admin-add-grid">
                <label>
                  Product Name
                  <input
                    type="text"
                    name="name"
                    value={addProductForm.name}
                    onChange={handleAddProductFieldChange}
                    required
                  />
                </label>

                <label>
                  Category
                  <input
                    type="text"
                    name="category"
                    value={addProductForm.category}
                    onChange={handleAddProductFieldChange}
                    placeholder="Skincare / Hair / Body Care"
                    required
                  />
                </label>

                <label>
                  Price
                  <input
                    type="number"
                    name="price"
                    value={addProductForm.price}
                    onChange={handleAddProductFieldChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </label>

                <label>
                  Image Filename
                  <input
                    type="text"
                    name="image"
                    value={addProductForm.image}
                    onChange={handleAddProductFieldChange}
                    placeholder="example.jpg"
                    required
                  />
                </label>
              </div>

              <label className="admin-add-description">
                Description
                <textarea
                  name="description"
                  value={addProductForm.description}
                  onChange={handleAddProductFieldChange}
                  rows="4"
                  placeholder="Write product description..."
                />
              </label>

              <p className="admin-add-note">
                Image must exist in <strong>public/products</strong> with the same filename.
              </p>

              {addProductInfo && <p className="admin-add-info">{addProductInfo}</p>}
              {addProductError && <p className="admin-add-info admin-add-info-error">{addProductError}</p>}

              <div className="admin-add-actions">
                <button type="button" className="admin-view-btn" onClick={closeAddProductModal}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn" disabled={addProductSubmitting}>
                  {addProductSubmitting ? "Saving..." : "Save Product"}
                </button>
              </div>
            </form>
      </AccessibleModal>

      <AccessibleModal
        isOpen={isEditProductModalOpen}
        onClose={closeEditProductModal}
        className="admin-modal admin-add-modal"
        overlayClassName="admin-modal-overlay"
        ariaLabelledBy="admin-edit-product-title"
      >
            <button
              type="button"
              className="admin-modal-close"
              onClick={closeEditProductModal}
              aria-label="Close edit product"
            >
              <FiX size={20} />
            </button>

            <h3 id="admin-edit-product-title">Edit Product Details</h3>

            <form className="admin-add-form" onSubmit={handleEditProductSubmit}>
              <div className="admin-add-grid">
                <label>
                  Product Name
                  <input
                    type="text"
                    name="name"
                    value={editProductForm.name}
                    onChange={handleEditProductFieldChange}
                    required
                  />
                </label>

                <label>
                  Category
                  <input
                    type="text"
                    name="category"
                    value={editProductForm.category}
                    onChange={handleEditProductFieldChange}
                    required
                  />
                </label>

                <label>
                  Price
                  <input
                    type="number"
                    name="price"
                    value={editProductForm.price}
                    onChange={handleEditProductFieldChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </label>

                <label>
                  Image Filename (Locked)
                  <input
                    type="text"
                    value={editProductForm.image}
                    disabled
                    readOnly
                  />
                </label>
              </div>

              <label className="admin-add-description">
                Description
                <textarea
                  name="description"
                  value={editProductForm.description}
                  onChange={handleEditProductFieldChange}
                  rows="4"
                  placeholder="Update product description..."
                />
              </label>

              <p className="admin-add-note">
                Image editing is disabled in this modal as requested.
              </p>

              {editProductError && <p className="admin-add-info admin-add-info-error">{editProductError}</p>}

              <div className="admin-add-actions">
                <button type="button" className="admin-view-btn" onClick={closeEditProductModal}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn" disabled={editProductSubmitting}>
                  {editProductSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
      </AccessibleModal>
    </main>
  );
}
