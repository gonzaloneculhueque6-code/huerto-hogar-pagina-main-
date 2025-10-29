import React from 'react';
import '../styles/admin.css';
import '../styles/estilo.css';

export default function Reportes({ productos, usuarios, ordenes = [] }) {
  const itemsBajoStock = productos.filter(p => p.stock <= p.criticalStock);

  const calcularTotalOrden = (items) => {
    if (!Array.isArray(items)) return 0;
    return items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  };
  
  const valorVentasCompletadas = ordenes
    .filter(o => o.estado === 'Completado')
    .reduce((acc, o) => acc + calcularTotalOrden(o.items), 0);

  return (
    <div>
      <h2 className="mb-4 titulo">Reportes Principales</h2>
      <div className="row mb-4">
        
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm text-center p-3 color-cartas h-100">
            <h5 className="texto_pric">Ventas Completadas</h5>
            <h1 className="display-4 fw-bold texto_pric">${valorVentasCompletadas.toLocaleString('es-CL')}</h1>
            <p className="texto_pric">Ingresos totales</p>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow-sm text-center p-3 color-cartas h-100">
            <h5 className="texto_pric">Total de Órdenes</h5>
            <h1 className="display-4 fw-bold texto_pric">{ordenes.length}</h1>
            <p className="texto_pric">Órdenes en el sistema</p>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow-sm text-center p-3 color-cartas h-100">
            <h5 className="texto_pric">Total de Usuarios</h5>
            <h1 className="display-4 fw-bold texto_pric">{usuarios.length}</h1>
            <p className="texto_pric">Usuarios registrados</p>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow-sm text-center p-3 color-cartas h-100">
            <h5 className="texto_pric">Items Bajos de Stock</h5>
            <h1 className="display-4 fw-bold texto_pric">{itemsBajoStock.length}</h1>
            <p className="texto_pric">Productos en o bajo el stock crítico</p>
          </div>
        </div>

      </div>

      {/* --- Tabla de Productos Bajos de Stock --- */}
      <div className="card shadow-sm mt-4">
        <div className="card-header">
            <h5 className="mb-0 titulo">Alerta de Inventario: Productos Bajos de Stock</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th className='text-center'>Stock Actual</th>
                  <th className='text-center'>Stock Crítico</th>
                </tr>
              </thead>
              <tbody>
                {itemsBajoStock.length > 0 ? (
                  itemsBajoStock.map(p => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.name}</td>
                      <td>{p.category}</td>
                      <td className='text-center'>
                        <span className="badge bg-danger">{p.stock}</span>
                      </td>
                      <td className='text-center'>{p.criticalStock}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-muted p-3">
                      ¡Buen trabajo! No hay productos bajos de stock.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}