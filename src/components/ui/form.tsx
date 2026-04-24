'use client'

import * as React from 'react'
import {
    Controller,
    FormProvider,
    useFormContext,
    type ControllerProps,
    type FieldPath,
    type FieldValues,
} from 'react-hook-form'

import { cn } from '@/lib/utils'

const Form = FormProvider

type FormFieldContextValue<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = { name: TName }

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue)

function FormField<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ ...props }: ControllerProps<TFieldValues, TName>) {
    return (
        <FormFieldContext.Provider value={{ name: props.name }}>
            <Controller {...props} />
        </FormFieldContext.Provider>
    )
}

function useFormField() {
    const fieldContext = React.useContext(FormFieldContext)
    const { getFieldState, formState } = useFormContext()
    const fieldState = getFieldState(fieldContext.name, formState)
    return { name: fieldContext.name, ...fieldState }
}

const FormItemContext = React.createContext<{ id: string }>({} as { id: string })

function FormItem({ className, ...props }: React.ComponentProps<'div'>) {
    const id = React.useId()
    return (
        <FormItemContext.Provider value={{ id }}>
            <div className={cn('flex flex-col gap-1.5', className)} {...props} />
        </FormItemContext.Provider>
    )
}

function FormLabel({ className, ...props }: React.ComponentProps<'label'>) {
    const { error } = useFormField()
    const { id } = React.useContext(FormItemContext)
    return (
        <label
            htmlFor={id}
            className={cn(
                'text-xs font-semibold uppercase tracking-widest text-on-surface-muted',
                error && 'text-destructive!',
                className
            )}
            {...props}
        />
    )
}

function FormControl({ ...props }: React.ComponentProps<'div'>) {
    const { error } = useFormField()
    const { id } = React.useContext(FormItemContext)
    return <div id={id} aria-invalid={!!error} {...props} />
}

function FormMessage({ className, ...props }: React.ComponentProps<'p'>) {
    const { error } = useFormField()
    const message = error?.message

    if (!message) return null

    return (
        <p className={cn('text-xs text-destructive', className)} {...props}>
            {message}
        </p>
    )
}

export { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, useFormField }
