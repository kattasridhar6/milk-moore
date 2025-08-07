from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
        extra_fields = ['image_url']

    def get_image_url(self, obj):
        admin_base_url = 'http://127.0.0.1:8000'  # replace with production URL later
        image_path = obj.image  # e.g. "/media/product_images/xyz.jpg"
        if not image_path.startswith('/'):
            image_path = '/' + image_path
        return f"{admin_base_url}{image_path}"