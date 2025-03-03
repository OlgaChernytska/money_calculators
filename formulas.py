from dataclasses import dataclass
import pandas as pd


@dataclass
class ClientData:
    age_now: int
    age_retirement: int
    age_death: int
    c0: float
    p: float
    r: float
    g: float
    i: float
    
    def __init__(self, age_now: int, age_retirement: int, age_death: int, c0: float, p: float, r: float = 0.07, g: float = 0, i: float = 0.02):
        self.age_now = age_now
        self.age_retirement = age_retirement
        self.age_death = age_death
        self.c0 = c0
        self.p = p
        self.r = r
        self.g = g
        self.i = i


def calculate_fv(c0: float, r: float, g: float, p: float, N: int) -> float:
    """
    Calculate the future value of an investment with an initial capital, annual return, and yearly savings.

    Parameters
    ----------
    c0 : float
        The initial capital (principal) at the start of the investment period.
    r : float
        The annual return rate (as a decimal, e.g., 0.07 for 7%).
    g : float
        The annual growth rate of the yearly savings (as a decimal, e.g., 0.02 for 2%).
    p : float
        The yearly payment (savings or contributions) made at the end of each year.
    N : int
        The number of years the investment will grow.

    Returns
    -------
    float
        The future value of the investment after N years, considering both the initial capital
        and yearly contributions with compounded interest.
    """
    return c0 * (1 + r) ** N + p * sum((1+r) ** (N-k) * (1+g) ** (k-1) for k in range(1, N+1))


def calculate_w1(c0: float, r: float, i: float, N: int):
    """
    Calculate the initial annual withdrawal amount that grows with inflation, ensuring the capital depletes to zero.

    Parameters
    ----------
    c0 : float
        The initial capital available at the start of withdrawals.
    r : float
        The annual return rate on the remaining capital (as a decimal, e.g., 0.05 for 5%).
    i : float
        The annual inflation rate (as a decimal, e.g., 0.02 for 2%), which affects the withdrawal amount.
    N : int
        The number of years over which withdrawals will be made.

    Returns
    -------
    float
        The initial annual withdrawal amount, which increases with inflation each year,
        ensuring the capital reaches exactly zero at the end of the period.
    """
    return (c0 * (1+r) ** N) / sum((1 + r) ** (N - 1 - k) * (1 + i) ** k for k in range(N))


def calculate_monthly_passive_income(client: ClientData) -> int:
    """
    Calculate the estimated monthly passive income during retirement using the provided ClientData.

    Parameters
    ----------
    client : ClientData
        A ClientData instance containing details about the individual, including:
        - age_now: Current age of the individual.
        - age_retirement: Age at which the individual plans to retire.
        - age_death: Expected age of death.
        - c0: Initial capital.
        - p: Annual contribution to the investment.
        - r: Annual return rate.
        - g: Annual growth rate of savings.
        - i: Annual inflation rate.

    Returns
    -------
    int
        The estimated monthly passive income during retirement in todays prices.
    """
    fv = calculate_fv(c0=client.c0, r=client.r, g=client.g, p=client.p * 12, N=client.age_retirement - client.age_now)
    w1 = calculate_w1(c0=fv, r=client.r, i=client.i, N=client.age_death - client.age_retirement + 1)
    w_pp = w1 / (1 + client.i) ** (client.age_retirement - client.age_now)
    return w_pp / 12


def create_acc_table(client: ClientData) -> pd.DataFrame:
    """
    Create an accumulation table showing the growth of capital over time using the provided ClientData.

    Parameters
    ----------
    client : ClientData
        A ClientData instance containing details about the individual, including:
        - age_now: Current age of the individual.
        - age_retirement: Age at which retirement is planned.
        - c0: Initial capital.
        - p: Monthly savings amount.
        - r: Annual return rate.
        - g: Annual growth rate of savings.

    Returns
    -------
    pd.DataFrame
        A DataFrame containing the following columns:
        - age: The individual's age for each year.
        - capital_year_start: Capital at the beginning of the year.
        - interest: Interest earned during the year.
        - saved: Amount saved during the year.
        - capital_year_end: Capital at the end of the year.
    """
    results = []
    capital_prev = client.c0
    
    for age in range(client.age_now, client.age_retirement):
        capital = calculate_fv(c0=client.c0, r=client.r, g=client.g, p=client.p * 12, N=age - client.age_now + 1)
        results.append({
            "age": age,
            "capital_year_start": capital_prev,
            "interest": capital_prev * client.r,
            "saved": client.p * 12 * (1 + client.g) ** (age - client.age_now),
            "capital_year_end": capital
        })
        capital_prev = capital
    
    return pd.DataFrame(results)


def create_dict_table(client: ClientData) -> pd.DataFrame:
    """
    Create a retirement table showing the withdrawal and capital changes over time using the provided ClientData.

    Parameters
    ----------
    client : ClientData
        A ClientData instance containing details about the individual, including:
        - age_now: Current age of the individual.
        - age_retirement: Age at which retirement is planned.
        - age_death: Expected age of death.
        - c0: Initial capital at the time of retirement.
        - p: Annual withdrawal amount (as a monthly value, converted to yearly).
        - r: Annual return rate.
        - g: Annual growth rate of savings.
        - i: Annual inflation rate.

    Returns
    -------
    pd.DataFrame
        A DataFrame containing the following columns:
        - age: The individual's age for each year from retirement until death.
        - capital_year_start: Capital at the start of each year.
        - saved: Amount withdrawn during the year.
        - interest: Interest earned during the year.
        - capital_year_end: Capital at the end of the year.
    """
    fv = calculate_fv(c0=client.c0, r=client.r, g=client.g, p=client.p * 12, N=client.age_retirement - client.age_now)
    w1 = calculate_w1(c0=fv, r=client.r, i=client.i, N=client.age_death - client.age_retirement + 1)
    
    results = []
    capital_prev = fv
    for age in range(client.age_retirement, client.age_death + 1):
        withdrawal = w1 * (1 + client.i) ** (age - client.age_retirement)
        capital = capital_prev  * (1 + client.r) - withdrawal
        results.append({
            "age": age,
            "capital_year_start": capital_prev,
            "saved": -withdrawal,
            "interest": capital_prev * client.r,
            "capital_year_end": capital
        })
        capital_prev = capital

    return pd.DataFrame(results)


def create_capital_lifecycle_table(client: ClientData) -> pd.DataFrame:
    """
    Create a table showing both the accumulation phase and the withdrawal phase of capital over time 
    using the provided ClientData.

    Parameters
    ----------
    client : ClientData
        A ClientData instance containing details about the individual, including:
        - age_now: Current age of the individual.
        - age_retirement: Age at which retirement is planned.
        - age_death: Expected age of death.
        - c0: Initial capital.
        - p: Monthly savings or withdrawal amount (converted to yearly).
        - r: Annual return rate.
        - g: Annual growth rate of savings.
        - i: Annual inflation rate.

    Returns
    -------
    pd.DataFrame
        A DataFrame combining the accumulation table (before retirement) and the distribution table 
        (after retirement) with the following columns:
        - age: The individual's age for each year.
        - capital_year_start: Capital at the beginning of the year.
        - interest: Interest earned during the year.
        - saved: Amount saved or withdrawn during the year.
        - capital_year_end: Capital at the end of the year.
    """
    acc_table = create_acc_table(client)
    dist_table = create_dict_table(client)
    cl_table = pd.concat([acc_table, dist_table]).reset_index(drop=True)
    cl_table['saved_pp_monthly'] = (cl_table['saved'] / (1+client.i) ** (cl_table['age'] - client.age_now) / 12)
    return cl_table.round(0).astype(int)
