import React, { useState } from 'react';
import '../styles/admin.css';

function ProductForm({ product, onSave, onCancel }) {
  const [formData, setFormData] = useState(product);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const isExistingProduct = product && product.id && !String(product.id).startsWith('TEMP-');

  return (
    <div className="card shadow-sm p-4 mb-4">
      <h3>{isExistingProduct ? 'Modificar Producto' : 'Agregar Nuevo Producto'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-3 mb-3">
            <label className="form-label">ID del Producto</label>
            <input
              type="text"
              className="form-control"
              name="id"
              value={formData.id}
              onChange={handleChange}
              required
              disabled={isExistingProduct}
              placeholder="Ingrese la ID del producto (EJ: MAN1)"
            />
            {isExistingProduct && <small className="text-muted">El ID real no se puede cambiar.</small>}
          </div>
          <div className="col-md-9 mb-3">
            <label className="form-label">Nombre del Producto*</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Ingrese Nombre del producto (EJ: MANZANA)"
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Descripción*</label>
          <textarea
            className="form-control"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            required
            placeholder="Ingrese Descripción del producto..."
          />
        </div>

        <div className="row">
          <div className="col-md-3 mb-3">
            <label className="form-label">Precio ($)*</label>
            <input
              type="number"
              step="1"
              className="form-control"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              placeholder="Ingrese Precio unitario del producto"
            />
          </div>
          <div className="col-md-3 mb-3">
            <label className="form-label">Stock Actual*</label>
            <input
              type="number"
              className="form-control"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              min="0"
              placeholder="Ingrese Stock actual del producto..."
            />
          </div>
          <div className="col-md-3 mb-3">
            <label className="form-label">Stock Crítico*</label>
            <input
              type="number"
              className="form-control"
              name="criticalStock"
              value={formData.criticalStock}
              onChange={handleChange}
              required
              min="0"
              placeholder="Ingrese Stock Critico..."
            />
          </div>
          <div className="col-md-3 mb-3">
            <label className="form-label">Categoría*</label>
            <select
              className="form-select"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione...</option>
              <option value="Frutas">Frutas</option>
              <option value="Verdura Organicas">Verdura Orgánicas</option>
              <option value="Productos Organicos">Productos Orgánicos</option>
              <option value="Productos Lacteos">Productos Lácteos</option>
              <option value="Semillas">Semillas</option>
              <option value="Otros">Otros</option>
            </select>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Nombre Imagen (ej: Manzana.PNG)</label>
          <input
            type="text"
            className="form-control"
            name="image"
            value={formData.image || ''}
            onChange={handleChange}
            placeholder="Ingrese el Nombre del archivo de la imagen..."
          />
        </div>

        <div className="d-flex justify-content-end mt-3">
          <button type="button" className="btn btn-secondary me-2" onClick={onCancel}>Cancelar</button>
          <button type="submit" className="btn btn-success">
            <i className="fas fa-save me-2"></i> {isExistingProduct ? 'Modificar Producto' : 'Agregar Producto'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function InventarioAdmin({ productos, setProductos }) {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const handleSaveProduct = (productData) => {
    const productToSave = {
      ...productData,
      stock: Number(productData.stock || 0),
      price: Number(productData.price || 0),
      criticalStock: Number(productData.criticalStock || 0),
      image: productData.image || 'default.png'
    };

    if (productos.some(p => p.id === productToSave.id && !String(p.id).startsWith('TEMP-'))) {
      setProductos(productos.map(p =>
        p.id === productToSave.id ? productToSave : p
      ));
      alert(`Producto "${productToSave.name}" actualizado.`);
    } else {
      const finalNewProduct = {
          ...productToSave,
          id: String(productToSave.id).startsWith('TEMP-') ? productToSave.id.replace('TEMP-', 'PROD-') : productToSave.id // Asigna un ID más permanente si era temporal
      };
      if (productos.some(p => p.id === finalNewProduct.id)) {
        alert(`Error: El ID "${finalNewProduct.id}" ya existe. Ingrese un ID único.`);
        return;
      }
      setProductos([...productos, finalNewProduct]);
      alert(`Nuevo producto "${productToSave.name}" agregado.`);
    }
    setIsFormVisible(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm("¿Está seguro de que desea eliminar este producto?")) {
      setProductos(productos.filter(p => p.id !== id));
      alert('Producto eliminado.');
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setIsFormVisible(true);
  };

  const handleAddClick = () => {
    setEditingProduct({
      id: '',
      name: '',
      stock: 0,
      price: 0,
      category: '',
      description: '',
      criticalStock: 10,
      image: ''
    });
    setIsFormVisible(true);
  };

  const handleCancelForm = () => {
    setIsFormVisible(false);
    setEditingProduct(null);
  };

  return (
    <div className="container-fluid px-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Lista de Productos</h4>
        <button
          className="btn btn-primary"
          onClick={handleAddClick}
          disabled={isFormVisible}
        >
          <i className="fas fa-plus me-2"></i> Agregar Nuevo Producto
        </button>
      </div>

      {isFormVisible && (
        <ProductForm
          product={editingProduct} 
          onSave={handleSaveProduct}
          onCancel={handleCancelForm}
        />
      )}

      {!isFormVisible && (
        <div className="card shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th className='text-center'>Stock</th>
                    <th>Stock Crítico</th>
                    <th>Precio</th>
                    <th>Categoría</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((product) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>{product.name}</td>
                      <td className='text-center'>
                        <span className={`badge ${
                          product.stock <= 0 ? 'bg-secondary' :
                          product.stock <= product.criticalStock ? 'bg-danger' : 
                          product.stock <= product.criticalStock * 2 ? 'bg-warning text-dark' : 
                          'bg-success'
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td>{product.criticalStock}</td>
                      <td>${(product.price || 0).toLocaleString('es-CL')}</td>
                      <td>{product.category}</td>
                      <td className="text-center">
                        <button className="btn btn-sm btn-info me-2 text-white" onClick={() => handleEditClick(product)}>
                          <i className="fas fa-edit"></i> Modificar
                        </button>
                        <button className="btn-rojo btn-sm" onClick={() => handleDeleteProduct(product.id)}> {/* btn-sm añadido */}
                          <i className="fas fa-trash-alt me-1"></i> Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                  {productos.length === 0 && (
                    <tr>
                      <td colSpan="7" className="text-center text-muted py-3">No hay productos en el inventario.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}