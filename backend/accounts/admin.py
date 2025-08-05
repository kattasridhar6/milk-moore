from django.contrib import admin
from .models import CustomUser, MilkInventory, Product

admin.site.register(CustomUser)
admin.site.register(MilkInventory)
admin.site.register(Product)