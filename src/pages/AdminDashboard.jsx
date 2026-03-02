import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiPlus, FiX } from "react-icons/fi";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import AccessibleModal from "../components/AccessibleModal";
import "./admin-dashboard.css";

const SIDEBAR_TABS = ["Orders", "Add Product", "Profile"];
const ORDER_STATUS_OPTIONS = ["placed", "processing", "shipped", "delivered", "cancelled"];

const formatCurrency = (value) => `Rs.${Number(value || 0).toLocaleString("en-IN")}`;

const formatDateTime = (value) => {
  if (!value) return "--";
  return new Date(value).toLocaleString();
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
  const [addProductForm, setAddProductForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });

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
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
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
    </main>
  );
}
