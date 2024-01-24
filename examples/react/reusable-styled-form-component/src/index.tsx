import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { Form } from './Form'
import { z } from 'zod'
import { Select } from './Select'

export default function App() {
  return (
    <div className="items-center justify-center flex h-full w-full">
      <Form
        className="space-y-6 w-72"
        formOptions={{
          defaultValues: {
            username: '',
            countryCode: '+1',
            phoneNumber: '',
            password: '',
            showPassword: false,
          },
        }}
      >
        {(useStore, reset) => (
          <>
            <Form.Field
              name="username"
              children={(field) => {
                return (
                  <Form.Field.Text
                    field={field}
                    label="Username"
                    autoComplete="name"
                    maxLength={30}
                  />
                )
              }}
            />
            <div className="relative flex">
              <Form.Field
                name="countryCode"
                children={(field) => {
                  return (
                    <Form.Field.Select
                      className="rounded-r-none w-20"
                      field={field}
                      displayValue
                    >
                      <Select.OptionGroup label="Country code" />
                      <Select.Option value="+1">+1 United States</Select.Option>
                      <Select.Option value="+44">
                        +44 United Kingdom
                      </Select.Option>
                      <Select.Option value="+49">+49 Germany</Select.Option>
                      <Select.Option value="+47">+47 Norway</Select.Option>
                    </Form.Field.Select>
                  )
                }}
              />
              <Form.Field
                name="phoneNumber"
                validators={{}}
                children={(field) => {
                  return (
                    <div className="relative w-full">
                      <Form.Field.Text
                        className="rounded-l-none"
                        field={field}
                        label="Phone Number"
                        type="tel"
                        autoComplete="tel"
                        maxLength={20}
                        onChange={(e) => {
                          const phoneNumberValue = e.target.value.replace(
                            /[^0-9\s()+-]/g,
                            '',
                          )
                          field.handleChange(phoneNumberValue)
                        }}
                      />
                      <Form.Field.Error field={field} />
                    </div>
                  )
                }}
              />
            </div>
            <Form.Field
              name="password"
              validators={
                useStore((state) => state.submissionAttempts) !== 0 && {
                  onChange: z
                    .string()
                    .min(9, "Password can't be less than 9 characters")
                    .max(20, "Password can't be more than 20 characters")
                    .refine(
                      (value) => /[A-Z]/.test(value),
                      'Password must include a capital letter',
                    )
                    .refine(
                      (value) => /\d/.test(value),
                      'Password must include a number',
                    ),
                }
              }
              children={(field) => {
                return (
                  <div className="relative">
                    <Form.Field.Text
                      field={field}
                      label="Password"
                      type={
                        useStore((state) => state.values.showPassword)
                          ? 'text'
                          : 'password'
                      }
                    />
                    <Form.Field.Error field={field} />
                  </div>
                )
              }}
            />
            <Form.Field
              name="showPassword"
              children={(field) => {
                return (
                  <Form.Field.Checkbox field={field} label="Show Password" />
                )
              }}
            />
            <div className="flex justify-between items-center">
              <Form.Subscribe selector={(state) => state}>
                {(state) => (
                  <Form.Subscribe.Button
                    className="text-blue-500 dark:text-blue-500"
                    state={state}
                    disabled={state.submissionAttempts === 0}
                    onClick={() => reset()}
                    variant="ghost"
                    size="xs"
                  >
                    Reset
                  </Form.Subscribe.Button>
                )}
              </Form.Subscribe>
              <Form.Subscribe selector={(state) => state}>
                {(state) => (
                  <Form.Subscribe.Button state={state}>
                    Submit
                  </Form.Subscribe.Button>
                )}
              </Form.Subscribe>
            </div>
          </>
        )}
      </Form>
    </div>
  )
}

const rootElement = document.getElementById('root')!

createRoot(rootElement).render(<App />)
