from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .serializers import SignupSerializer, MilkInventorySerializer, ProductSerializer, BillSerializer
from django.contrib.auth import authenticate, get_user_model
from .models import MilkInventory, Product, Bill
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import viewsets

User = get_user_model()

# ---------------- User Signup/Login ----------------

class SignupView(APIView):
    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# ---------------- Milk Inventory ----------------

class MilkInventoryCreateView(APIView):
    def post(self, request):
        milk_type = request.data.get('milk_type')
        quantity = request.data.get('quantity')
        procured_from = request.data.get('procured_from')
        procurement_date = request.data.get('procurement_date')

        if not milk_type or quantity is None:
            return Response({"error": "Missing milk_type or quantity"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            new_stock = MilkInventory.objects.create(
                milk_type=milk_type,
                quantity=quantity,
                procured_from=procured_from,
                procurement_date=procurement_date,
            )
            serializer = MilkInventorySerializer(new_stock)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class MilkInventoryListView(APIView):
    def get(self, request):
        stock = MilkInventory.objects.all().order_by('-added_at')
        serializer = MilkInventorySerializer(stock, many=True)
        return Response(serializer.data)

class MilkInventoryDetailView(APIView):
    def put(self, request, pk):
        try:
            stock = MilkInventory.objects.get(pk=pk)
        except MilkInventory.DoesNotExist:
            return Response({"error": "Stock not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = MilkInventorySerializer(stock, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            stock = MilkInventory.objects.get(pk=pk)
            stock.delete()
            return Response({"message": "Stock deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except MilkInventory.DoesNotExist:
            return Response({"error": "Stock not found"}, status=status.HTTP_404_NOT_FOUND)

# ---------------- Product Management ----------------

class ProductListCreateView(APIView):
    def get(self, request):
        products = Product.objects.all().order_by('-added_at')
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProductDetailView(APIView):
    def put(self, request, pk):
        try:
            product = Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProductSerializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            product = Product.objects.get(pk=pk)
            product.delete()
            return Response({"message": "Product deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    parser_classes = (MultiPartParser, FormParser)


class BillListCreateView(APIView):
    queryset = Bill.objects.all().order_by('-created_at')
    serializer_class = BillSerializer

class BillDetailView(APIView):
    queryset = Bill.objects.all()
    serializer_class = BillSerializer