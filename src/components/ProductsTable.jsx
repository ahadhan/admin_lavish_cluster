import React from "react";

const ProductsTable = ({ products }) => {
  const handleEdit = (productId) => {
    // Add edit functionality here
    console.log("Edit product:", productId);
  };

  const handleDelete = (productId) => {
    // Add delete functionality here
    console.log("Delete product:", productId);
  };

  return (
    <div className="overflow-x-auto mx-5 p-6 bg-black border border-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-white mb-4">Product List</h2>
      <table className="min-w-full bg-black">
        <thead>
          <tr>
            <th className="py-3 px-6 bg-gray-100">Title</th>
            <th className="py-3 px-6 bg-gray-100">Description</th>
            <th className="py-3 px-6 bg-gray-100">Price</th>
            <th className="py-3 px-6 bg-gray-100">Image URL</th>
            <th className="py-3 px-6 bg-gray-100">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index} className="border-2 border-gray-700 text-white">
              <td className="py-3 px-6">{product.title}</td>
              <td className="py-3 px-6">{product.description}</td>
              <td className="py-3 px-6">${product.price.toFixed(2)}</td>
              <td className="py-3 px-6">
                <a
                  href={product.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  {product.imageUrl}
                </a>
              </td>
              <td className="py-3 px-6 flex space-x-4">
                <button
                  onClick={() => handleEdit(product.id)}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsTable;
