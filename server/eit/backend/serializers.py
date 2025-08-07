from rest_framework import serializers
from .models import User, Folder, Test, Session, AnswerRecord

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'role']

class FolderSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    class Meta:
        model = Folder
        fields = ['id', 'name', 'access_code', 'owner']

class TestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = ['id', 'folder', 'title', 'section_number', 'delta', 'created_at']
        read_only_fields = ['id', 'created_at']

class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = ['id', 'student', 'test', 'started_at', 'finished_at']
        read_only_fields = ['id', 'started_at', 'finished_at']

class AnswerRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnswerRecord
        fields = ['id', 'session', 'question_index', 'answer', 'answered_at']
        read_only_fields = ['id', 'answered_at']