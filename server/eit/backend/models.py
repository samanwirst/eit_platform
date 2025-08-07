import string, random
from django.db import models
from django.contrib.auth.models import AbstractUser

def make_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('student', 'Student'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')

class Folder(models.Model):
    name = models.CharField(max_length=200)
    access_code = models.CharField(max_length=6, unique=True, default=make_code)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='folders')

    def __str__(self):
        return f'{self.name} ({self.access_code})'

class Test(models.Model):
    SECTION_TYPES = (
        ('writing', 'Writing'),
        ('reading', 'Reading'),
        ('listening', 'Listening'),
    )

    folder = models.ForeignKey(Folder, on_delete=models.CASCADE, related_name='tests')
    title = models.CharField(max_length=255)
    section_number = models.PositiveIntegerField()
    section_type = models.CharField(max_length=20, choices=SECTION_TYPES)
    delta = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.get_section_type_display()} #{self.pk} – {self.title}'

class Session(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sessions')
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name='sessions')
    started_at = models.DateTimeField(auto_now_add=True)
    finished_at = models.DateTimeField(null=True, blank=True)

class AnswerRecord(models.Model):
    session = models.ForeignKey(Session, on_delete=models.CASCADE, related_name='answers')
    question_index = models.PositiveIntegerField()
    answer = models.TextField()  # например JSON строка с выбором студента
    answered_at = models.DateTimeField(auto_now_add=True)