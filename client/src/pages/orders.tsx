import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/auth-context";

const Orders = () => {
  const { user } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Fetch user orders
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ["/api/orders"],
  });

  // Format date 
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "processing":
        return <Badge className="bg-orange-400">Processing</Badge>;
      case "shipped":
        return <Badge className="bg-blue-500">Shipped</Badge>;
      case "delivered":
        return <Badge className="bg-green-500">Delivered</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-400">Unknown</Badge>;
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading your orders...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error loading orders. Please try again.</div>;
  }

  if (!orders || orders.length === 0) {
    return (
      <div>
        <h1 className="text-3xl font-semibold text-[#1D3557] mb-8">Your Orders</h1>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-[#457B9D] text-4xl mb-4">
              <i className="fas fa-box-open"></i>
            </div>
            <h2 className="text-xl font-semibold text-[#1D3557] mb-4">No orders yet</h2>
            <p className="text-[#457B9D] mb-6">You haven't placed any orders with us yet.</p>
            <Button 
              className="bg-[#1D3557] hover:bg-[#457B9D]"
              onClick={() => window.location.href = "/"}
            >
              Start Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold text-[#1D3557] mb-8">Your Orders</h1>
      
      <div className="space-y-4">
        {orders.map((order: any) => (
          <Card key={order.id} className="overflow-hidden">
            <CardHeader className="bg-[#F1FAEE] py-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div>
                  <CardTitle className="text-lg font-medium text-[#1D3557]">Order #{order.orderNumber}</CardTitle>
                  <p className="text-sm text-[#457B9D]">Placed on {formatDate(order.createdAt)}</p>
                </div>
                <div className="flex space-x-2 mt-2 sm:mt-0">
                  {getStatusBadge(order.status)}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-[#457B9D] text-[#457B9D] hover:bg-[#F1FAEE] hover:text-[#1D3557]"
                        onClick={() => setSelectedOrder(order)}
                      >
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Order #{selectedOrder?.orderNumber}</DialogTitle>
                      </DialogHeader>
                      {selectedOrder && (
                        <div className="mt-4">
                          <div className="flex justify-between mb-4">
                            <div>
                              <p className="text-sm text-[#457B9D]">Ordered on</p>
                              <p className="font-medium text-[#1D3557]">{formatDate(selectedOrder.createdAt)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-[#457B9D]">Status</p>
                              <div>{getStatusBadge(selectedOrder.status)}</div>
                            </div>
                          </div>
                          
                          <Separator className="my-4" />
                          
                          <h4 className="font-medium text-[#1D3557] mb-2">Items</h4>
                          <div className="space-y-3">
                            {selectedOrder.items.map((item: any) => (
                              <div key={item.id} className="flex justify-between">
                                <div className="flex">
                                  <div className="w-12 h-12 rounded overflow-hidden mr-3">
                                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-[#1D3557]">{item.name}</p>
                                    <p className="text-xs text-[#457B9D]">Size: {item.size} | Color: {item.color}</p>
                                    <p className="text-xs text-[#457B9D]">Qty: {item.quantity}</p>
                                  </div>
                                </div>
                                <p className="font-medium text-[#1D3557]">${(item.price * item.quantity).toFixed(2)}</p>
                              </div>
                            ))}
                          </div>
                          
                          <Separator className="my-4" />
                          
                          <h4 className="font-medium text-[#1D3557] mb-2">Shipping Address</h4>
                          <p className="text-[#457B9D]">
                            {selectedOrder.shippingAddress.address}<br />
                            {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}<br />
                            {selectedOrder.shippingAddress.country}
                          </p>
                          
                          <Separator className="my-4" />
                          
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-[#457B9D]">Subtotal</span>
                              <span className="text-[#1D3557]">${selectedOrder.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#457B9D]">Shipping</span>
                              <span className="text-[#1D3557]">${selectedOrder.shipping.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#457B9D]">Tax</span>
                              <span className="text-[#1D3557]">${selectedOrder.tax.toFixed(2)}</span>
                            </div>
                            <div className="pt-2 border-t border-gray-100 flex justify-between font-semibold">
                              <span className="text-[#1D3557]">Total</span>
                              <span className="text-[#1D3557]">${selectedOrder.total.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent className="py-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-[#457B9D]">Items</p>
                  <p className="font-medium text-[#1D3557]">{order.items.length} product(s)</p>
                </div>
                <div>
                  <p className="text-sm text-[#457B9D]">Total</p>
                  <p className="font-medium text-[#1D3557]">${order.total.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-[#457B9D]">Shipping</p>
                  <p className="font-medium text-[#1D3557]">
                    {order.status === "delivered" 
                      ? "Delivered on " + formatDate(order.deliveredAt) 
                      : "Estimated delivery " + formatDate(order.estimatedDeliveryDate)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Orders;
