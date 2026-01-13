import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teacherApi } from '../services/api';

export const useTeachers = (params = {}) => {
  return useQuery({
    queryKey: ['teachers', params],
    queryFn: () => teacherApi.getAll(params),
    keepPreviousData: true,
  });
};

export const useTeacher = (id) => {
  return useQuery({
    queryKey: ['teacher', id],
    queryFn: () => teacherApi.getById(id),
    enabled: !!id, // Only run if id exists
  });
};

export const useCreateTeacher = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: teacherApi.create,
    onSuccess: () => {
      // Invalidate teachers query to refetch
      queryClient.invalidateQueries(['teachers']);
    },
  });
};

export const useUpdateTeacher = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => teacherApi.update(id, data),
    onSuccess: (data, variables) => {
      // Update cache for this teacher
      queryClient.setQueryData(['teacher', variables.id], data);
      // Invalidate teachers list
      queryClient.invalidateQueries(['teachers']);
    },
  });
};

export const useDeleteTeacher = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: teacherApi.delete,
    onSuccess: () => {
      // Invalidate teachers query
      queryClient.invalidateQueries(['teachers']);
    },
  });
};

export const useSearchTeachers = (query) => {
  return useQuery({
    queryKey: ['teachers', 'search', query],
    queryFn: () => teacherApi.search(query),
    enabled: !!query, // Only run if query exists
  });
};