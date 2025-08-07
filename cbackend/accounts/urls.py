from django.urls import path
from .views import ProductListView, SignupView, LoginView

urlpatterns = [
    path('products/', ProductListView.as_view(), name='product-list'),
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
]
