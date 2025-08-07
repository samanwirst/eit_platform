from rest_framework import viewsets, mixins, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Folder, Test, Session, AnswerRecord, User
from .serializers import (
    FolderSerializer, TestSerializer,
    SessionSerializer, AnswerRecordSerializer,
    UserSerializer
)
from .permissions import IsAdmin, IsStudent
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

class FolderViewSet(viewsets.ModelViewSet):
    queryset = Folder.objects.all()
    serializer_class = FolderSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsStudent])
    def join(self, request, pk=None):
        folder = self.get_object()
        code = request.data.get('code', '')
        if code != folder.access_code:
            return Response({'detail': 'Wrong code'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(FolderSerializer(folder).data)

class TestViewSet(viewsets.ModelViewSet):
    queryset = Test.objects.all()
    serializer_class = TestSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

class SessionViewSet(viewsets.GenericViewSet,
                     mixins.CreateModelMixin,
                     mixins.RetrieveModelMixin,
                     mixins.ListModelMixin):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer
    permission_classes = [IsAuthenticated, IsStudent]

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)

class AnswerRecordViewSet(viewsets.GenericViewSet,
                          mixins.CreateModelMixin,
                          mixins.ListModelMixin):
    queryset = AnswerRecord.objects.all()
    serializer_class = AnswerRecordSerializer
    permission_classes = [IsAuthenticated, IsStudent]


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        tok = super().get_token(user)
        tok['role'] = user.role
        return tok

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer