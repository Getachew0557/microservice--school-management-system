import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentApi } from '../services/api';

export const useStudents = (params = {}) => {
  return useQuery({
    queryKey: ['students', params],
    queryFn: () => studentApi.getAll(params),
    keepPreviousData: true,
  });
};

export const useStudent = (id) => {
  return useQuery({
    queryKey: ['student', id],
    queryFn: () => studentApi.getById(id),
    enabled: !!id, // Only run if id exists
  });
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: studentApi.create,
    onSuccess: () => {
      // Invalidate students query to refetch
      queryClient.invalidateQueries(['students']);
    },
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => studentApi.update(id, data),
    onSuccess: (data, variables) => {
      // Update cache for this student
      queryClient.setQueryData(['student', variables.id], data);
      // Invalidate students list
      queryClient.invalidateQueries(['students']);
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: studentApi.delete,
    onSuccess: () => {
      // Invalidate students query
      queryClient.invalidateQueries(['students']);
    },
  });
};

export const useSearchStudents = (query) => {
  return useQuery({
    queryKey: ['students', 'search', query],
    queryFn: () => studentApi.search(query),
    enabled: !!query, // Only run if query exists
  });
};