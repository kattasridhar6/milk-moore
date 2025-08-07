from django.contrib.auth.models import AbstractUser
from django.db import models

class Product(models.Model):
    UNIT_CHOICES = [
        ('kilograms', 'Kilograms'),
        ('liters', 'Liters'),
    ]

    name = models.CharField(max_length=100, unique=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=20, choices=UNIT_CHOICES, default='grams')
    added_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - ₹{self.price} / {self.unit}"