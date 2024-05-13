/* eslint-disable */
import type { Prisma, SpaceUser } from "@zenstackhq/runtime/models";
import type { UseMutationOptions, UseQueryOptions, UseInfiniteQueryOptions, InfiniteData } from '@tanstack/react-query';
import { getHooksContext } from '@zenstackhq/tanstack-query/runtime-v5/react';
import { useModelQuery, useInfiniteModelQuery, useModelMutation } from '@zenstackhq/tanstack-query/runtime-v5/react';
import type { PickEnumerable, CheckSelect, QueryError, ExtraQueryOptions, ExtraMutationOptions } from '@zenstackhq/tanstack-query/runtime-v5';
import type { PolicyCrudKind } from '@zenstackhq/runtime'
import metadata from './__model_meta';
type DefaultError = QueryError;
import { useSuspenseModelQuery, useSuspenseInfiniteModelQuery } from '@zenstackhq/tanstack-query/runtime-v5/react';
import type { UseSuspenseQueryOptions, UseSuspenseInfiniteQueryOptions } from '@tanstack/react-query';

export function useCreateSpaceUser(options?: Omit<(UseMutationOptions<(SpaceUser | undefined), DefaultError, Prisma.SpaceUserCreateArgs> & ExtraMutationOptions), 'mutationFn'>) {
    const { endpoint, fetch } = getHooksContext();
    const _mutation =
        useModelMutation<Prisma.SpaceUserCreateArgs, DefaultError, SpaceUser, true>('SpaceUser', 'POST', `${endpoint}/spaceUser/create`, metadata, options, fetch, true)
        ;
    const mutation = {
        ..._mutation,
        mutateAsync: async <T extends Prisma.SpaceUserCreateArgs>(
            args: Prisma.SelectSubset<T, Prisma.SpaceUserCreateArgs>,
            options?: Omit<(UseMutationOptions<(CheckSelect<T, SpaceUser, Prisma.SpaceUserGetPayload<T>> | undefined), DefaultError, Prisma.SelectSubset<T, Prisma.SpaceUserCreateArgs>> & ExtraMutationOptions), 'mutationFn'>
        ) => {
            return (await _mutation.mutateAsync(
                args,
                options as any
            )) as (CheckSelect<T, SpaceUser, Prisma.SpaceUserGetPayload<T>> | undefined);
        },
    };
    return mutation;
}

export function useCreateManySpaceUser(options?: Omit<(UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.SpaceUserCreateManyArgs> & ExtraMutationOptions), 'mutationFn'>) {
    const { endpoint, fetch } = getHooksContext();
    const _mutation =
        useModelMutation<Prisma.SpaceUserCreateManyArgs, DefaultError, Prisma.BatchPayload, false>('SpaceUser', 'POST', `${endpoint}/spaceUser/createMany`, metadata, options, fetch, false)
        ;
    const mutation = {
        ..._mutation,
        mutateAsync: async <T extends Prisma.SpaceUserCreateManyArgs>(
            args: Prisma.SelectSubset<T, Prisma.SpaceUserCreateManyArgs>,
            options?: Omit<(UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.SelectSubset<T, Prisma.SpaceUserCreateManyArgs>> & ExtraMutationOptions), 'mutationFn'>
        ) => {
            return (await _mutation.mutateAsync(
                args,
                options as any
            )) as Prisma.BatchPayload;
        },
    };
    return mutation;
}

export function useFindManySpaceUser<TArgs extends Prisma.SpaceUserFindManyArgs, TQueryFnData = Array<Prisma.SpaceUserGetPayload<TArgs> & { $optimistic?: boolean }>, TData = TQueryFnData, TError = DefaultError>(args?: Prisma.SelectSubset<TArgs, Prisma.SpaceUserFindManyArgs>, options?: (Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useModelQuery<TQueryFnData, TData, TError>('SpaceUser', `${endpoint}/spaceUser/findMany`, args, options, fetch);
}

export function useInfiniteFindManySpaceUser<TArgs extends Prisma.SpaceUserFindManyArgs, TQueryFnData = Array<Prisma.SpaceUserGetPayload<TArgs>>, TData = TQueryFnData, TError = DefaultError>(args?: Prisma.SelectSubset<TArgs, Prisma.SpaceUserFindManyArgs>, options?: Omit<UseInfiniteQueryOptions<TQueryFnData, TError, InfiniteData<TData>>, 'queryKey'>) {
    options = options ?? { initialPageParam: undefined, getNextPageParam: () => null };
    const { endpoint, fetch } = getHooksContext();
    return useInfiniteModelQuery<TQueryFnData, TData, TError>('SpaceUser', `${endpoint}/spaceUser/findMany`, args, options, fetch);
}

export function useSuspenseFindManySpaceUser<TArgs extends Prisma.SpaceUserFindManyArgs, TQueryFnData = Array<Prisma.SpaceUserGetPayload<TArgs> & { $optimistic?: boolean }>, TData = TQueryFnData, TError = DefaultError>(args?: Prisma.SelectSubset<TArgs, Prisma.SpaceUserFindManyArgs>, options?: (Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useSuspenseModelQuery<TQueryFnData, TData, TError>('SpaceUser', `${endpoint}/spaceUser/findMany`, args, options, fetch);
}

export function useSuspenseInfiniteFindManySpaceUser<TArgs extends Prisma.SpaceUserFindManyArgs, TQueryFnData = Array<Prisma.SpaceUserGetPayload<TArgs>>, TData = TQueryFnData, TError = DefaultError>(args?: Prisma.SelectSubset<TArgs, Prisma.SpaceUserFindManyArgs>, options?: Omit<UseSuspenseInfiniteQueryOptions<TQueryFnData, TError, InfiniteData<TData>>, 'queryKey'>) {
    options = options ?? { initialPageParam: undefined, getNextPageParam: () => null };
    const { endpoint, fetch } = getHooksContext();
    return useSuspenseInfiniteModelQuery<TQueryFnData, TData, TError>('SpaceUser', `${endpoint}/spaceUser/findMany`, args, options, fetch);
}

export function useFindUniqueSpaceUser<TArgs extends Prisma.SpaceUserFindUniqueArgs, TQueryFnData = Prisma.SpaceUserGetPayload<TArgs> & { $optimistic?: boolean }, TData = TQueryFnData, TError = DefaultError>(args: Prisma.SelectSubset<TArgs, Prisma.SpaceUserFindUniqueArgs>, options?: (Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useModelQuery<TQueryFnData, TData, TError>('SpaceUser', `${endpoint}/spaceUser/findUnique`, args, options, fetch);
}

export function useSuspenseFindUniqueSpaceUser<TArgs extends Prisma.SpaceUserFindUniqueArgs, TQueryFnData = Prisma.SpaceUserGetPayload<TArgs> & { $optimistic?: boolean }, TData = TQueryFnData, TError = DefaultError>(args: Prisma.SelectSubset<TArgs, Prisma.SpaceUserFindUniqueArgs>, options?: (Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useSuspenseModelQuery<TQueryFnData, TData, TError>('SpaceUser', `${endpoint}/spaceUser/findUnique`, args, options, fetch);
}

export function useFindFirstSpaceUser<TArgs extends Prisma.SpaceUserFindFirstArgs, TQueryFnData = Prisma.SpaceUserGetPayload<TArgs> & { $optimistic?: boolean }, TData = TQueryFnData, TError = DefaultError>(args?: Prisma.SelectSubset<TArgs, Prisma.SpaceUserFindFirstArgs>, options?: (Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useModelQuery<TQueryFnData, TData, TError>('SpaceUser', `${endpoint}/spaceUser/findFirst`, args, options, fetch);
}

export function useSuspenseFindFirstSpaceUser<TArgs extends Prisma.SpaceUserFindFirstArgs, TQueryFnData = Prisma.SpaceUserGetPayload<TArgs> & { $optimistic?: boolean }, TData = TQueryFnData, TError = DefaultError>(args?: Prisma.SelectSubset<TArgs, Prisma.SpaceUserFindFirstArgs>, options?: (Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useSuspenseModelQuery<TQueryFnData, TData, TError>('SpaceUser', `${endpoint}/spaceUser/findFirst`, args, options, fetch);
}

export function useUpdateSpaceUser(options?: Omit<(UseMutationOptions<(SpaceUser | undefined), DefaultError, Prisma.SpaceUserUpdateArgs> & ExtraMutationOptions), 'mutationFn'>) {
    const { endpoint, fetch } = getHooksContext();
    const _mutation =
        useModelMutation<Prisma.SpaceUserUpdateArgs, DefaultError, SpaceUser, true>('SpaceUser', 'PUT', `${endpoint}/spaceUser/update`, metadata, options, fetch, true)
        ;
    const mutation = {
        ..._mutation,
        mutateAsync: async <T extends Prisma.SpaceUserUpdateArgs>(
            args: Prisma.SelectSubset<T, Prisma.SpaceUserUpdateArgs>,
            options?: Omit<(UseMutationOptions<(CheckSelect<T, SpaceUser, Prisma.SpaceUserGetPayload<T>> | undefined), DefaultError, Prisma.SelectSubset<T, Prisma.SpaceUserUpdateArgs>> & ExtraMutationOptions), 'mutationFn'>
        ) => {
            return (await _mutation.mutateAsync(
                args,
                options as any
            )) as (CheckSelect<T, SpaceUser, Prisma.SpaceUserGetPayload<T>> | undefined);
        },
    };
    return mutation;
}

export function useUpdateManySpaceUser(options?: Omit<(UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.SpaceUserUpdateManyArgs> & ExtraMutationOptions), 'mutationFn'>) {
    const { endpoint, fetch } = getHooksContext();
    const _mutation =
        useModelMutation<Prisma.SpaceUserUpdateManyArgs, DefaultError, Prisma.BatchPayload, false>('SpaceUser', 'PUT', `${endpoint}/spaceUser/updateMany`, metadata, options, fetch, false)
        ;
    const mutation = {
        ..._mutation,
        mutateAsync: async <T extends Prisma.SpaceUserUpdateManyArgs>(
            args: Prisma.SelectSubset<T, Prisma.SpaceUserUpdateManyArgs>,
            options?: Omit<(UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.SelectSubset<T, Prisma.SpaceUserUpdateManyArgs>> & ExtraMutationOptions), 'mutationFn'>
        ) => {
            return (await _mutation.mutateAsync(
                args,
                options as any
            )) as Prisma.BatchPayload;
        },
    };
    return mutation;
}

export function useUpsertSpaceUser(options?: Omit<(UseMutationOptions<(SpaceUser | undefined), DefaultError, Prisma.SpaceUserUpsertArgs> & ExtraMutationOptions), 'mutationFn'>) {
    const { endpoint, fetch } = getHooksContext();
    const _mutation =
        useModelMutation<Prisma.SpaceUserUpsertArgs, DefaultError, SpaceUser, true>('SpaceUser', 'POST', `${endpoint}/spaceUser/upsert`, metadata, options, fetch, true)
        ;
    const mutation = {
        ..._mutation,
        mutateAsync: async <T extends Prisma.SpaceUserUpsertArgs>(
            args: Prisma.SelectSubset<T, Prisma.SpaceUserUpsertArgs>,
            options?: Omit<(UseMutationOptions<(CheckSelect<T, SpaceUser, Prisma.SpaceUserGetPayload<T>> | undefined), DefaultError, Prisma.SelectSubset<T, Prisma.SpaceUserUpsertArgs>> & ExtraMutationOptions), 'mutationFn'>
        ) => {
            return (await _mutation.mutateAsync(
                args,
                options as any
            )) as (CheckSelect<T, SpaceUser, Prisma.SpaceUserGetPayload<T>> | undefined);
        },
    };
    return mutation;
}

export function useDeleteSpaceUser(options?: Omit<(UseMutationOptions<(SpaceUser | undefined), DefaultError, Prisma.SpaceUserDeleteArgs> & ExtraMutationOptions), 'mutationFn'>) {
    const { endpoint, fetch } = getHooksContext();
    const _mutation =
        useModelMutation<Prisma.SpaceUserDeleteArgs, DefaultError, SpaceUser, true>('SpaceUser', 'DELETE', `${endpoint}/spaceUser/delete`, metadata, options, fetch, true)
        ;
    const mutation = {
        ..._mutation,
        mutateAsync: async <T extends Prisma.SpaceUserDeleteArgs>(
            args: Prisma.SelectSubset<T, Prisma.SpaceUserDeleteArgs>,
            options?: Omit<(UseMutationOptions<(CheckSelect<T, SpaceUser, Prisma.SpaceUserGetPayload<T>> | undefined), DefaultError, Prisma.SelectSubset<T, Prisma.SpaceUserDeleteArgs>> & ExtraMutationOptions), 'mutationFn'>
        ) => {
            return (await _mutation.mutateAsync(
                args,
                options as any
            )) as (CheckSelect<T, SpaceUser, Prisma.SpaceUserGetPayload<T>> | undefined);
        },
    };
    return mutation;
}

export function useDeleteManySpaceUser(options?: Omit<(UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.SpaceUserDeleteManyArgs> & ExtraMutationOptions), 'mutationFn'>) {
    const { endpoint, fetch } = getHooksContext();
    const _mutation =
        useModelMutation<Prisma.SpaceUserDeleteManyArgs, DefaultError, Prisma.BatchPayload, false>('SpaceUser', 'DELETE', `${endpoint}/spaceUser/deleteMany`, metadata, options, fetch, false)
        ;
    const mutation = {
        ..._mutation,
        mutateAsync: async <T extends Prisma.SpaceUserDeleteManyArgs>(
            args: Prisma.SelectSubset<T, Prisma.SpaceUserDeleteManyArgs>,
            options?: Omit<(UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.SelectSubset<T, Prisma.SpaceUserDeleteManyArgs>> & ExtraMutationOptions), 'mutationFn'>
        ) => {
            return (await _mutation.mutateAsync(
                args,
                options as any
            )) as Prisma.BatchPayload;
        },
    };
    return mutation;
}

export function useAggregateSpaceUser<TArgs extends Prisma.SpaceUserAggregateArgs, TQueryFnData = Prisma.GetSpaceUserAggregateType<TArgs>, TData = TQueryFnData, TError = DefaultError>(args: Prisma.SelectSubset<TArgs, Prisma.SpaceUserAggregateArgs>, options?: (Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useModelQuery<TQueryFnData, TData, TError>('SpaceUser', `${endpoint}/spaceUser/aggregate`, args, options, fetch);
}

export function useSuspenseAggregateSpaceUser<TArgs extends Prisma.SpaceUserAggregateArgs, TQueryFnData = Prisma.GetSpaceUserAggregateType<TArgs>, TData = TQueryFnData, TError = DefaultError>(args: Prisma.SelectSubset<TArgs, Prisma.SpaceUserAggregateArgs>, options?: (Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useSuspenseModelQuery<TQueryFnData, TData, TError>('SpaceUser', `${endpoint}/spaceUser/aggregate`, args, options, fetch);
}

export function useGroupBySpaceUser<TArgs extends Prisma.SpaceUserGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<TArgs>>, Prisma.Extends<'take', Prisma.Keys<TArgs>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? { orderBy: Prisma.SpaceUserGroupByArgs['orderBy'] } : { orderBy?: Prisma.SpaceUserGroupByArgs['orderBy'] }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<TArgs['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<TArgs['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<TArgs['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends TArgs['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True
    ? `Error: "by" must not be empty.`
    : HavingValid extends Prisma.False
    ? {
        [P in HavingFields]: P extends ByFields
        ? never
        : P extends string
        ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
        : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`,
        ]
    }[HavingFields]
    : 'take' extends Prisma.Keys<TArgs>
    ? 'orderBy' extends Prisma.Keys<TArgs>
    ? ByValid extends Prisma.True
    ? {}
    : {
        [P in OrderFields]: P extends ByFields
        ? never
        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
    }[OrderFields]
    : 'Error: If you provide "take", you also need to provide "orderBy"'
    : 'skip' extends Prisma.Keys<TArgs>
    ? 'orderBy' extends Prisma.Keys<TArgs>
    ? ByValid extends Prisma.True
    ? {}
    : {
        [P in OrderFields]: P extends ByFields
        ? never
        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
    }[OrderFields]
    : 'Error: If you provide "skip", you also need to provide "orderBy"'
    : ByValid extends Prisma.True
    ? {}
    : {
        [P in OrderFields]: P extends ByFields
        ? never
        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
    }[OrderFields], TQueryFnData = {} extends InputErrors ?
    Array<PickEnumerable<Prisma.SpaceUserGroupByOutputType, TArgs['by']> &
        {
            [P in ((keyof TArgs) & (keyof Prisma.SpaceUserGroupByOutputType))]: P extends '_count'
            ? TArgs[P] extends boolean
            ? number
            : Prisma.GetScalarType<TArgs[P], Prisma.SpaceUserGroupByOutputType[P]>
            : Prisma.GetScalarType<TArgs[P], Prisma.SpaceUserGroupByOutputType[P]>
        }
    > : InputErrors, TData = TQueryFnData, TError = DefaultError>(args: Prisma.SelectSubset<TArgs, Prisma.SubsetIntersection<TArgs, Prisma.SpaceUserGroupByArgs, OrderByArg> & InputErrors>, options?: (Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useModelQuery<TQueryFnData, TData, TError>('SpaceUser', `${endpoint}/spaceUser/groupBy`, args, options, fetch);
}

export function useSuspenseGroupBySpaceUser<TArgs extends Prisma.SpaceUserGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<TArgs>>, Prisma.Extends<'take', Prisma.Keys<TArgs>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? { orderBy: Prisma.SpaceUserGroupByArgs['orderBy'] } : { orderBy?: Prisma.SpaceUserGroupByArgs['orderBy'] }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<TArgs['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<TArgs['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<TArgs['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends TArgs['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True
    ? `Error: "by" must not be empty.`
    : HavingValid extends Prisma.False
    ? {
        [P in HavingFields]: P extends ByFields
        ? never
        : P extends string
        ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
        : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`,
        ]
    }[HavingFields]
    : 'take' extends Prisma.Keys<TArgs>
    ? 'orderBy' extends Prisma.Keys<TArgs>
    ? ByValid extends Prisma.True
    ? {}
    : {
        [P in OrderFields]: P extends ByFields
        ? never
        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
    }[OrderFields]
    : 'Error: If you provide "take", you also need to provide "orderBy"'
    : 'skip' extends Prisma.Keys<TArgs>
    ? 'orderBy' extends Prisma.Keys<TArgs>
    ? ByValid extends Prisma.True
    ? {}
    : {
        [P in OrderFields]: P extends ByFields
        ? never
        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
    }[OrderFields]
    : 'Error: If you provide "skip", you also need to provide "orderBy"'
    : ByValid extends Prisma.True
    ? {}
    : {
        [P in OrderFields]: P extends ByFields
        ? never
        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
    }[OrderFields], TQueryFnData = {} extends InputErrors ?
    Array<PickEnumerable<Prisma.SpaceUserGroupByOutputType, TArgs['by']> &
        {
            [P in ((keyof TArgs) & (keyof Prisma.SpaceUserGroupByOutputType))]: P extends '_count'
            ? TArgs[P] extends boolean
            ? number
            : Prisma.GetScalarType<TArgs[P], Prisma.SpaceUserGroupByOutputType[P]>
            : Prisma.GetScalarType<TArgs[P], Prisma.SpaceUserGroupByOutputType[P]>
        }
    > : InputErrors, TData = TQueryFnData, TError = DefaultError>(args: Prisma.SelectSubset<TArgs, Prisma.SubsetIntersection<TArgs, Prisma.SpaceUserGroupByArgs, OrderByArg> & InputErrors>, options?: (Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useSuspenseModelQuery<TQueryFnData, TData, TError>('SpaceUser', `${endpoint}/spaceUser/groupBy`, args, options, fetch);
}

export function useCountSpaceUser<TArgs extends Prisma.SpaceUserCountArgs, TQueryFnData = TArgs extends { select: any; } ? TArgs['select'] extends true ? number : Prisma.GetScalarType<TArgs['select'], Prisma.SpaceUserCountAggregateOutputType> : number, TData = TQueryFnData, TError = DefaultError>(args?: Prisma.SelectSubset<TArgs, Prisma.SpaceUserCountArgs>, options?: (Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useModelQuery<TQueryFnData, TData, TError>('SpaceUser', `${endpoint}/spaceUser/count`, args, options, fetch);
}

export function useSuspenseCountSpaceUser<TArgs extends Prisma.SpaceUserCountArgs, TQueryFnData = TArgs extends { select: any; } ? TArgs['select'] extends true ? number : Prisma.GetScalarType<TArgs['select'], Prisma.SpaceUserCountAggregateOutputType> : number, TData = TQueryFnData, TError = DefaultError>(args?: Prisma.SelectSubset<TArgs, Prisma.SpaceUserCountArgs>, options?: (Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useSuspenseModelQuery<TQueryFnData, TData, TError>('SpaceUser', `${endpoint}/spaceUser/count`, args, options, fetch);
}
import type { SpaceUserRole } from '@zenstackhq/runtime/models';

export function useCheckSpaceUser<TError = DefaultError>(args: { operation: PolicyCrudKind; where?: { id?: string; spaceId?: string; userId?: string; role?: SpaceUserRole }; }, options?: (Omit<UseQueryOptions<boolean, TError, boolean>, 'queryKey'> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useModelQuery<boolean, boolean, TError>('SpaceUser', `${endpoint}/spaceUser/check`, args, options, fetch);
}
