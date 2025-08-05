from django.urls import path
from .views import (
    SignupView,
    MilkInventoryCreateView, MilkInventoryListView,
    MilkInventoryDetailView,
    ProductListCreateView, ProductDetailView, BillListCreateView, BillDetailView
)

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('milk-inventory/', MilkInventoryListView.as_view(), name='inventory-list'),
    path('milk-inventory/add/', MilkInventoryCreateView.as_view(), name='inventory-add'),
    path('milk-inventory/<int:pk>/', MilkInventoryDetailView.as_view(), name='inventory-detail'),
    path('products/', ProductListCreateView.as_view(), name='product-list-create'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
     path('api/bills/', BillListCreateView.as_view(), name='bill-list-create'),
    path('api/bills/<int:pk>/', BillDetailView.as_view(), name='bill-detail'),
]
